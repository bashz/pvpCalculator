var width = 960,
        height = 600;

// calculation is meant to be carried by R[], array of configured customers
// set in the memory, sum and other values are then compiled.
var R = ["z", "z", "z", "z", "z", "z", "z", "z", "z", "z"];
var current = {customer: null, attack: {Price: null}, defence: {Price: null}, extra: {Price: null}};

var svg = d3.select("#calculator").append("svg")
        .attr("width", width)
        .attr("height", height);

var tooltip = d3.select("#calculator").append("div").attr("class", "tooltip hidden");

var chars = svg.append("g").attr("id", "chars");

var items = svg.append("g").attr("id", "items");

var weapons = d3.select("#attack");
var protections = d3.select("#defence");
var supportives = d3.select("#extra");

var result = svg.append("g").attr("id", "result");
var results = new Array();
for (var i = 1; i <= 10; i++) {
    results[i] = result.append("rect")
            .attr("x", 700 - ((i % 2 - 1) * 130))
            .attr("y", Math.floor((i - 1) / 2) * 100)
            .attr("width", 130)
            .attr("height", 100)
            .attr("fill", "rgba(200, 200, 200, 0.2)")
            .attr("stroke", "#000")
            .attr("stroke-width", "2");
}
var sum = result.append("rect")
        .attr("x", 700)
        .attr("y", 500)
        .attr("width", 260)
        .attr("height", 52)
        .attr("fill", "rgba(200, 200, 200, 0.2)")
        .attr("stroke", "#000")
        .attr("stroke-width", "2");

var main = svg.append("g").attr("id", "main");
main.append("rect")
        .attr("x", 380)
        .attr("y", 100)
        .attr("width", 160)
        .attr("height", 160)
        .attr("fill", "rgba(200, 200, 200, 0.2)")
        .attr("stroke", "#000")
        .attr("stroke-width", "2");
var char = main.append("g").attr("id", "mainImage");
var Slider = svg.append("g").attr("id", "slider");
var level = main.append("g");
var currentDamage = main.append("g");

var attack = svg.append("g").attr("id", "attack");
attack.append("rect")
        .attr("x", 560)
        .attr("y", 60)
        .attr("width", 96)
        .attr("height", 96)
        .attr("fill", "rgba(200, 200, 200, 0.2)")
        .attr("stroke", "#000")
        .attr("stroke-width", "2");
var defence = svg.append("g").attr("id", "defence");
defence.append("rect")
        .attr("x", 560)
        .attr("y", 200)
        .attr("width", 96)
        .attr("height", 96)
        .attr("fill", "rgba(200, 200, 200, 0.2)")
        .attr("stroke", "#000")
        .attr("stroke-width", "2");
var extra = svg.append("g").attr("id", "extra");
extra.append("rect")
        .attr("x", 560)
        .attr("y", 340)
        .attr("width", 96)
        .attr("height", 96)
        .attr("fill", "rgba(200, 200, 200, 0.2)")
        .attr("stroke", "#000")
        .attr("stroke-width", "2");

var weaponsByCustomer = d3.map(), protectionsByCustomer = d3.map(), supportivesByCustomer = d3.map();

function Damage() {
    var damage = Math.round(current.customer.baseDamage +
            Math.sqrt(current.attack.Price) +
            Math.sqrt(current.defence.Price) +
            Math.sqrt(current.extra.Price));
    currentDamage.selectAll("text").remove();
    currentDamage.append("text")
            .html("Damage : " + damage)
            .attr("x", 420)
            .attr("y", 380);
}
function addConfig(position) {
    result.append("image")
            .attr("x", 720 - ((position % 2 - 1) * 130))
            .attr("y", 10 + Math.floor((position - 1) / 2) * 100)
            .attr("width", 48)
            .attr("height", 48)
            .attr("cursor", "pointer")
            .attr("xlink:href", "images/chars/icon/" + current.customer.icon);
    if (current.attack.image) {
        result.append("image")
                .attr("x", 800 - ((position % 2 - 1) * 130))
                .attr("y", Math.floor((position - 1) / 2) * 100)
                .attr("width", 16)
                .attr("height", 16)
                .attr("cursor", "pointer")
                .attr("xlink:href", "images/items/icon/" + current.attack.image);
    }
    if (current.defence.image) {
        result.append("image")
                .attr("x", 800 - ((position % 2 - 1) * 130))
                .attr("y", 20 + Math.floor((position - 1) / 2) * 100)
                .attr("width", 16)
                .attr("height", 16)
                .attr("cursor", "pointer")
                .attr("xlink:href", "images/items/icon/" + current.defence.image);
    }
    if (current.extra.image) {
        result.append("image")
                .attr("x", 800 - ((position % 2 - 1) * 130))
                .attr("y", 40 + Math.floor((position - 1) / 2) * 100)
                .attr("width", 16)
                .attr("height", 16)
                .attr("cursor", "pointer")
                .attr("xlink:href", "images/items/icon/" + current.extra.image);
    }
    var edit = result.append("image")
            .attr("x", 700 - ((position % 2 - 1) * 130))
            .attr("y", 15 + Math.floor((position - 1) / 2) * 100)
            .attr("width", 16)
            .attr("height", 16)
            .attr("title", "Edit")
            .attr("cursor", "pointer")
            .attr("xlink:href", "images/edit.png");
    edit.on("click", function () {
        current = R[position - 1];
        R[position -1] = "z";
        reloadItems(current.customer.id);
        main.selectAll("image").remove();
        attack.selectAll("image").remove();
        defence.selectAll("image").remove();
        extra.selectAll("image").remove();
        char.selectAll("image").remove();
        var t = char.append("image")
                .attr("x", 380)
                .attr("y", 100)
                .attr("width", 159)
                .attr("height", 159)
                .attr("cursor", "pointer")
                .attr("xlink:href", "images/chars/" + current.customer.image);
    });
    var remove = result.append("image")
            .attr("x", 700 - ((position % 2 - 1) * 130))
            .attr("y", 35 + Math.floor((position - 1) / 2) * 100)
            .attr("width", 16)
            .attr("height", 16)
            .attr("cursor", "pointer")
            .attr("xlink:href", "images/remove.png");
    result.append("text")
            .html(function () {
                return Math.round(current.customer.baseDamage +
                        Math.sqrt(current.attack.Price) +
                        Math.sqrt(current.defence.Price) +
                        Math.sqrt(current.extra.Price));
            })
            .attr("x", 750 - ((position % 2 - 1) * 130))
            .attr("y", 90 + Math.floor((position - 1) / 2) * 100);
}
function duration(time) {
    if (time === 1) {
        return "vshort.png";
    } else if (time === 2) {
        return "short.png";
    } else if (time === 3) {
        return "medium.png";
    } else if (time === 4) {
        return "long.png";
    } else if (time === 5) {
        return "vlong.png";
    } else {
        return "error.png";
    }
}
function load() {
    //meant to load a pvp config from url.
    return 1;
}

function reloadItems(customer) {
    d3.select("#calculator").selectAll("li").remove();
    weapon = weapons.selectAll(".weapons")
            .data(weaponsByCustomer.get(customer))
            .enter().append("li")
            .html(function (d) {
                return d.Recipe;
            }).style("list-style-image", function (d) {
        return "url(images/items/icon/" + d.image + ")";
    });
    protection = protections.selectAll(".protections")
            .data(protectionsByCustomer.get(customer))
            .enter().append("li")
            .html(function (d) {
                return d.Recipe;
            }).style("list-style-image", function (d) {
        return "url(images/items/icon/" + d.image + ")";
    });
    supportive = supportives.selectAll(".supportives")
            .data(supportivesByCustomer.get(customer))
            .enter().append("li")
            .html(function (d) {
                return d.Recipe;
            }).style("list-style-image", function (d) {
        return "url(images/items/icon/" + d.image + ")";
    });
    weapon
            .on("mousemove", function (d) {
                var mouse = d3.mouse(svg.node()).map(function (d) {
                    return parseInt(d);
                });
                tooltip.classed("hidden", false)
                        //Values are meant to be computed
                        .attr("style", "left:" + (mouse[0] + 10) + "px;top:" + (mouse[1] + 10) + "px")
                        .html("<img src='images/" + duration(d.Time) + "' ><ul><li>" + d.Price + " $ </li><li>" + d.Worker + "</li><li>" + d.Time + "</li></ul>");
            })
            .on("mouseout", function () {
                tooltip.classed("hidden", true);
            })
            .on("click", function (d) {
                attack.selectAll("image").remove();
                var t = attack.append("image")
                        .attr("x", 560)
                        .attr("y", 60)
                        .attr("width", 96)
                        .attr("height", 96)
                        .attr("cursor", "pointer")
                        .attr("xlink:href", "images/items/small/" + d.image);
                current.attack = d;
                Damage();
                t.on("click", function () {
                    attack.selectAll("image").remove();
                    current.attack = {Price: null};
                    Damage();
                });
            });
    protection
            .on("mousemove", function (d) {
                var mouse = d3.mouse(svg.node()).map(function (d) {
                    return parseInt(d);
                });
                tooltip.classed("hidden", false)
                        //Values are meant to be computed
                        .attr("style", "left:" + (mouse[0] + 10) + "px;top:" + (mouse[1] + 10) + "px")
                        .html("<img src='images/" + duration(d.Time) + "' ><ul><li>" + d.Price + " $ </li><li>" + d.Worker + "</li><li>" + d.Time + "</li></ul>");
            })
            .on("mouseout", function () {
                tooltip.classed("hidden", true);
            })
            .on("click", function (d) {
                defence.selectAll("image").remove();
                var t = defence.append("image")
                        .attr("x", 560)
                        .attr("y", 200)
                        .attr("width", 96)
                        .attr("height", 96)
                        .attr("cursor", "pointer")
                        .attr("xlink:href", "images/items/small/" + d.image);
                current.defence = d;
                Damage();
                t.on("click", function () {
                    defence.selectAll("image").remove();
                    current.defence = {Price: null};
                    Damage();
                });
            });
    supportive
            .on("mousemove", function (d) {
                var mouse = d3.mouse(svg.node()).map(function (d) {
                    return parseInt(d);
                });
                tooltip.classed("hidden", false)
                        //Values are meant to be computed
                        .attr("style", "left:" + (mouse[0] + 10) + "px;top:" + (mouse[1] + 10) + "px")
                        .html("<img src='images/" + duration(d.Time) + "' ><ul><li>" + d.Price + " $ </li><li>" + d.Worker + "</li><li>" + d.Time + "</li></ul>");
            })
            .on("mouseout", function () {
                tooltip.classed("hidden", true);
            })
            .on("click", function (d) {
                extra.selectAll("image").remove();
                var t = extra.append("image")
                        .attr("x", 560)
                        .attr("y", 340)
                        .attr("width", 96)
                        .attr("height", 96)
                        .attr("cursor", "pointer")
                        .attr("xlink:href", "images/items/small/" + d.image);
                current.extra = d;
                Damage();
                t.on("click", function () {
                    extra.selectAll("image").remove();
                    current.extra = {Price: null};
                    Damage();
                });
            });
}

d3.json("json/data.json", function (data) {
    var charCell = width / data.game.chars.length;
    var charRect = chars.selectAll(".chars")
            .data(data.game.chars)
            .enter().append("rect")
            .attr("x", function (d, i) {
                //we will map here to avoid extra loop (spoiler : nasty for code)
                //we also avoid numbrous loops by looping into the chars-item keys
                //instead of looping all items ;)
                //thought some data modification would make this even faster ...
                var map = new Array();
                for (var j = 0; j < d.weapons.length; j++) {
                    for (var k = 0; k < data.game.items.weapons[d.weapons[j]].length; k++)
                        map.push(data.game.items.weapons[d.weapons[j]][k]);
                }
                weaponsByCustomer.set(d.id, map);

                var map = new Array();
                for (var j = 0; j < d.protections.length; j++) {
                    for (var k = 0; k < data.game.items.protections[d.protections[j]].length; k++)
                        map.push(data.game.items.protections[d.protections[j]][k]);
                }
                protectionsByCustomer.set(d.id, map);

                var map = new Array();
                for (var j = 0; j < d.supportive.length; j++) {
                    for (var k = 0; k < data.game.items.supportive[d.supportive[j]].length; k++)
                        map.push(data.game.items.supportive[d.supportive[j]][k]);
                }
                supportivesByCustomer.set(d.id, map);
                //this is what originaly the function is meant for
                return i * charCell;
            })
            .attr("y", 552)
            .attr("width", (charCell - 1))
            .attr("height", 48)
            .attr("stroke", "#000")
            .attr("fill", function (d) {
                if (d.class === "fighter")
                    return "rgb(255, 0, 0)";
                else if (d.class === "rogue")
                    return "rgb(255, 255, 0)";
                else if (d.class === "caster")
                    return "rgb(0, 255, 0)";
                else
                    return "rgb(120, 120,120)";
            });

    var charIcon = chars.append("g").selectAll(".chars")
            .data(data.game.chars)
            .enter().append("image")
            .attr("x", function (d, i) {
                return i * charCell;
            })
            .attr("y", 560)
            .attr("width", 40)
            .attr("height", 40)
            .attr("xlink:href", function (d) {
                return "images/chars/icon/" + d.icon;
            });
    charIcon
            .on("mouseover", function () {
                d3.select(this)
                        .transition()
                        .attr("y", 552)
                        .attr("width", 48)
                        .attr("height", 48)
                        .duration(300)
                        .attr("cursor", "pointer");
            })
            .on("mouseout", function () {
                d3.select(this)
                        .transition()
                        .attr("y", 560)
                        .attr("width", 40)
                        .attr("height", 40)
                        .duration(700);
            })
            .on("click", function (d) {
                reloadItems(d.id);
                current = {customer: null, attack: {Price: null}, defence: {Price: null}, extra: {Price: null}};
                current.customer = d;
                main.selectAll("image").remove();
                attack.selectAll("image").remove();
                defence.selectAll("image").remove();
                extra.selectAll("image").remove();
                char.selectAll("image").remove();
                var t = char.append("image")
                        .attr("x", 380)
                        .attr("y", 100)
                        .attr("width", 159)
                        .attr("height", 159)
                        .attr("cursor", "pointer")
                        .attr("xlink:href", "images/chars/" + d.image);
                drawSlider(1, 20);
                var pvp = main.append("image")
                        .attr("x", 396)
                        .attr("y", 400)
                        .attr("width", 126)
                        .attr("height", 110)
                        .attr("cursor", "pointer")
                        .attr("xlink:href", "images/pvp.png");
                t.on("click", function () {
                    d3.select("#calculator").selectAll("li").remove();
                    attack.selectAll("image").remove();
                    defence.selectAll("image").remove();
                    extra.selectAll("image").remove();
                    char.selectAll("image").remove();
                    Slider.select("g").remove();
                    main.selectAll("text").remove();
                    main.selectAll("image").remove();
                    current = {customer: null, attack: {Price: null}, defence: {Price: null}, extra: {Price: null}};
                });
                pvp.on("click", function () {
                    var position = R.indexOf('z');
                    R[position] = current;
                    addConfig(position + 1);
                    d3.select("#calculator").selectAll("li").remove();
                    attack.selectAll("image").remove();
                    defence.selectAll("image").remove();
                    extra.selectAll("image").remove();
                    char.selectAll("image").remove();
                    Slider.select("g").remove();
                    main.selectAll("text").remove();
                    main.selectAll("image").remove();
                    /// do add data here
                    current = {customer: null, attack: {Price: null}, defence: {Price: null}, extra: {Price: null}};
                });
            });

    function drawSlider(min, max) {
        var h = 50;
        Slider.select("g").remove();
        var svgSlider = Slider.attr("height", h)
                .append("g")
                .attr("transform", "translate(380,262) scale(0.8)");
        var x = d3.scale.linear()
                .domain([min, max])
                .range([0, 190])
                .clamp(true);
        var brush = d3.svg.brush()
                .x(x)
                .extent([0, 0])
                .on("brush", brushed);
        svgSlider.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h / 2 + ")")
                .call(
                        d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickSize(0)
                        .tickPadding(12)
                        )
                .select(".domain")
                .select(function () {
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr("class", "halo");
        var slider = svgSlider.append("g")
                .attr("class", "slider")
                .call(brush);
        slider.selectAll(".extent,.resize")
                .remove();
        slider.select(".background")
                .attr("height", h);
        var handle = slider.append("circle")
                .attr("class", "handle")
                .attr("transform", "translate(0," + h / 2 + ")")
                .attr("r", 9);
        slider
                .call(brush.event)
                .transition() // gratuitous intro!
                .duration(750)
                .call(brush.extent([10, 10]))
                .call(brush.event);
        function brushed() {
            var value = brush.extent()[0];
            if (d3.event.sourceEvent) { // not a programmatic event
                value = x.invert(d3.mouse(this)[0]);
                brush.extent([value, value]);
            }
            handle.attr("cx", x(value));
            level.selectAll("text").remove();
            level.append("text")
                    .html("Level : " + Math.round(value))
                    .attr("x", 420)
                    .attr("y", 330);
            current.customer.level = value;
            current.customer.baseDamage = data.game.levels[Math.round(value)];
            Damage();
        }
    }
});