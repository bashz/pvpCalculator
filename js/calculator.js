var width = 960, height = 600;

var R = ["z", "z", "z", "z", "z", "z", "z", "z", "z", "z"];
var current = {customer: null, attack: {Price: null}, defence: {Price: null}, extra: {Price: null}};

var svg = d3.select("#calculator").append("svg")
        .attr("width", width)
        .attr("height", height);

var tooltip = d3.select("#calculator").append("div").attr("class", "tooltip hidden");
var chars = svg.append("g").attr("id", "chars");
var result = svg.append("g").attr("id", "result");
var main = svg.append("g").attr("id", "main");

var weapons = d3.select("#attack");
var protections = d3.select("#defence");
var supportives = d3.select("#extra");

var Slider = main.append("g").attr("id", "slider");
var level = main.append("g");
var currentDamage = main.append("g");
var allDamage = d3.select("#Total");
var attack = main.append("g").attr("id", "attack");
var defence = main.append("g").attr("id", "defence");
var extra = main.append("g").attr("id", "extra");
var levels = new Array();
var ressources = new Array();
var results = new Array();
var resultRect = new Array();
var weaponsByCustomer = d3.map(), protectionsByCustomer = d3.map(), supportivesByCustomer = d3.map();
var slider;

d3.selection.prototype.holder = function (x, y, w, h) {
    var rect = this.append("rect").attr("x", x).attr("y", y)
            .attr("class", "holder").attr("width", w).attr("height", h);
    return rect;
};
d3.selection.prototype.sent = function (position, x, y, w, h, image) {
    var image = this.append("image")
            .attr("x", x + 830 - ((position % 2) * 130)).attr("y", y + Math.floor(position / 2) * 100)
            .attr("xlink:href", "images/" + image).attr("width", w).attr("height", h);
    return image;
};
function initInterface() {
    for (var i = 0; i < 10; i++) {
        resultRect[i] = result.holder(830 - ((i % 2) * 130), Math.floor(i / 2) * 100, 130, 100);
        results[i] = result.append("g");
    }
    result.holder(700, 500, 260, 52);
    main.holder(380, 100, 160, 160);
    attack.holder(560, 60, 96, 96);
    defence.holder(560, 200, 96, 96);
    extra.holder(560, 340, 96, 96);
}
function setItems(item, itemCategory, d, data) {
    var map = new Array();
    for (var j = 0; j < d[itemCategory].length; j++) {
        for (var k = 0; k < data[d[itemCategory][j]].length; k++)
            map.push(data[d[itemCategory][j]][k]);
    }
    item.set(d.id, map);
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
function formatRessources(d) {
    inner = "";
    for (var i in d.Ressources) {
        inner += "<img src='images/ressources/" + ressources[i] + "'>" + d.Ressources[i] + " ";
    }
    return inner;
}
function addItem(d, target, dataTarget, y) {
    target.selectAll("image").remove();
    var t = target.append("image")
            .attr("x", 560)
            .attr("y", y)
            .attr("width", 96)
            .attr("height", 96)
            .attr("cursor", "pointer")
            .attr("xlink:href", "images/items/small/" + d.image);
    current[dataTarget] = d;
    Damage();
    t.on("click", function () {
        target.selectAll("image").remove();
        current[dataTarget] = {Price: null};
        Damage();
    });
}
function drawChar(d) {
    main.selectAll("image").remove();
    var t = char.append("image")
            .attr("x", 380)
            .attr("y", 100)
            .attr("width", 159)
            .attr("height", 159)
            .attr("cursor", "pointer")
            .attr("xlink:href", "images/chars/" + d.image);

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
}
function drawPVP() {
    var pvp = main.append("image")
            .attr("x", 396)
            .attr("y", 400)
            .attr("width", 126)
            .attr("height", 110)
            .attr("cursor", "pointer")
            .attr("xlink:href", "images/pvp.png");
    pvp.on("click", function () {
        slider.interrupt().transition();
        var position = R.indexOf('z');
        if (position === -1) {
            window.alert("you can only send 10 customers");
        }
        R[position] = JSON.parse(JSON.stringify(current));
        send(position);
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
}
function newChar(d) {
    d3.select("#calculator").selectAll("li").remove();
    reloadItems(d.id, weapons, weaponsByCustomer, attack, "attack", 60);
    reloadItems(d.id, protections, protectionsByCustomer, defence, "defence", 200);
    reloadItems(d.id, supportives, supportivesByCustomer, extra, "extra", 340);
    current = {customer: null, attack: {Price: null}, defence: {Price: null}, extra: {Price: null}};
    current.customer = d;
    drawChar(d);
    drawPVP();
}
function editChar(position) {
    d3.select("#calculator").selectAll("li").remove();
    current = R[position];
    R[position] = "z";
    reloadItems(current.customer.id, weapons, weaponsByCustomer, attack, "attack", 60);
    reloadItems(current.customer.id, protections, protectionsByCustomer, defence, "defence", 200);
    reloadItems(current.customer.id, supportives, supportivesByCustomer, extra, "extra", 340);
    results[position].selectAll("image").remove();
    results[position].selectAll("text").remove();
    drawChar(current.customer);
    drawPVP();
    if (current.attack.image) {
        addItem(current.attack, attack, "attack", 60);
    }
    if (current.defence.image) {
        addItem(current.defence, defence, "defence", 200);
    }
    if (current.extra.image) {
        addItem(current.extra, extra, "extra", 340);
    }
    drawSlider(current.customer.min, current.customer.max, current.customer.level);
    totalDamage();
}
function send(position) {
    results[position].sent(position, 10, 10, 48, 48, "chars/icon/" + current.customer.icon);
    if (current.attack.image) {
        results[position].sent(position, 70, 6, 16, 16, "items/icon/" + current.attack.image);
    }
    if (current.defence.image) {
        results[position].sent(position, 70, 24, 16, 15, "items/icon/" + current.defence.image);
    }
    if (current.extra.image) {
        results[position].sent(position, 70, 44, 16, 16, "items/icon/" + current.extra.image);
    }
    var edit = results[position].sent(position, 10, 70, 20, 20, "edit.png");
    edit.attr("cursor", "pointer");
    var remove = results[position].sent(position, 40, 70, 20, 20, "remove.png");
    remove.attr("cursor", "pointer");
    results[position].append("text")
            .html(function () {
                return current.customer.baseDamage +
                        Math.floor(Math.sqrt(current.attack.Price)) +
                        Math.floor(Math.sqrt(current.defence.Price)) +
                        Math.floor(Math.sqrt(current.extra.Price));
            })
            .attr("x", 80 + 830 - ((position % 2) * 130))
            .attr("y", 86 + Math.floor(position / 2) * 100);
    edit.on("click", function () {
        editChar(position);
    });
    remove.on("click", function () {
        R[position] = "z";
        results[position].selectAll("image").remove();
        results[position].selectAll("text").remove();
        totalDamage();
    });
    totalDamage();
}
function reloadItems(customer, category, map, target, dataTarget, y) {
    listedItem = category.selectAll(".items")
            .data(map.get(customer))
            .enter().append("li")
            .html(function (d) {
                return d.Recipe;
            }).style("list-style-image", function (d) {
        return "url(images/items/icon/" + d.image + ")";
    });
    listedItem
            .on("mousemove", function (d) {
                var mouse = d3.mouse(svg.node()).map(function (d) {
                    return parseInt(d);
                });
                tooltip.classed("hidden", false)
                        .attr("style", "left:" + (mouse[0] + 10) + "px;top:" + (mouse[1] + 10) + "px")
                        .html("<img src='images/" + duration(d.Time) +
                                "' ><ul><li style='color:#a0a0ff;font-weight:bold;'>Damage : " + Math.floor(Math.sqrt(d.Price)) +
                                "</li><li>" + d.Price +
                                " $ </li><li>" + d.Worker +
                                "</li><li>lvl : " + d.Level +
                                "</li><li>Craft : " + d.CXP +
                                " xp</li></ul>" +
                                "<ul>" + ((d.Level <= current.customer.level) ? "<li style='color:#00ff00;'>10 %" :
                                        (d.Level <= (current.customer.level + 1)) ? "<li style='color:#ffff00;'>25 %" :
                                        (d.Level <= (current.customer.level + 2)) ? "<li style='color:#ffaa00;'>50 %" :
                                        "<li style='color:#ff0000;'>90 %") +
                                "</li>" + (d.Rare ? "<li style='color:#edbd00;font-weight:bold;'>Rare" : "<li style='color:#00ff00;'>Common") +
                                "</li><li>" + d.Workstation +
                                "</li><li>" + d.MaxResource +
                                "</li><li>Sell : " + d.SXP +
                                " xp</li></ul><div>" + formatRessources(d) +
                                "</div>");
            })
            .on("mouseout", function () {
                tooltip.classed("hidden", true);
            })
            .on("click", function (d) {
                addItem(d, target, dataTarget, y)
            });

}
function Damage() {
    var damage = current.customer.baseDamage +
            Math.floor(Math.sqrt(current.attack.Price)) +
            Math.floor(Math.sqrt(current.defence.Price)) +
            Math.floor(Math.sqrt(current.extra.Price));
    currentDamage.selectAll("text").remove();
    currentDamage.append("text")
            .html("Damage : " + damage)
            .attr("x", 420)
            .attr("y", 380);
}
function totalDamage() {
    var total = 0;
    var fighter = 0;
    var rogue = 0;
    var caster = 0;
    for (var i = 0; i < 10; i++) {
        if (R[i] !== 'z') {
            total += R[i].customer.baseDamage +
                    Math.floor(Math.sqrt(R[i].attack.Price)) +
                    Math.floor(Math.sqrt(R[i].defence.Price)) +
                    Math.floor(Math.sqrt(R[i].extra.Price));
            if (R[i].customer.class === "fighter") {
                fighter += R[i].customer.baseDamage +
                        Math.floor(Math.sqrt(R[i].attack.Price)) +
                        Math.floor(Math.sqrt(R[i].defence.Price)) +
                        Math.floor(Math.sqrt(R[i].extra.Price));
            }
            if (R[i].customer.class === "rogue") {
                rogue += R[i].customer.baseDamage +
                        Math.floor(Math.sqrt(R[i].attack.Price)) +
                        Math.floor(Math.sqrt(R[i].defence.Price)) +
                        Math.floor(Math.sqrt(R[i].extra.Price));
            }
            if (R[i].customer.class === "caster") {
                caster += R[i].customer.baseDamage +
                        Math.floor(Math.sqrt(R[i].attack.Price)) +
                        Math.floor(Math.sqrt(R[i].defence.Price)) +
                        Math.floor(Math.sqrt(R[i].extra.Price));
            }
        }
    }
    allDamage.selectAll("div").remove();
    allDamage
            .html("<div id='fighter-total'>" + fighter +
                    "</div><div id='rogue-total'>" + rogue +
                    "</div><div id='caster-total'>" + caster +
                    "</div><div id='totalDamage'>Damage : " + total + "</div>");
}
function drawSlider(min, max, v) {
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
                    .ticks(6)
                    .tickSize(0)
                    .tickPadding(12)
                    )
            .select(".domain")
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "halo");
    slider = svgSlider.append("g")
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
            .call(brush.extent([v, v]))
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
        current.customer.level = Math.round(value);
        current.customer.baseDamage = levels[Math.round(value)];
        Damage();
    }
}

initInterface();
totalDamage()
var char = main.append("g").attr("id", "mainImage");
d3.json("json/data.json", function (data) {
    levels = data.game.levels;
    ressources = data.game.ressources;
    var charCell = width / data.game.chars.length;
    chars.selectAll(".chars")
            .data(data.game.chars)
            .enter().append("rect")
            .attr("x", function (d, i) {
                setItems(weaponsByCustomer, "weapons", d, data.game.items.weapons);
                setItems(protectionsByCustomer, "protections", d, data.game.items.protections);
                setItems(supportivesByCustomer, "supportive", d, data.game.items.supportive);
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
                newChar(d);
                drawSlider(d.min, d.max, (d.min + d.max) / 2);
            });
});