var width = 960, height = 600;

var R = ["z", "z", "z", "z", "z", "z", "z", "z", "z", "z"];
var current = {customer: null, attack: {Price: null}, defence: {Price: null}, extra: {Price: null}};
var orderState = {Price: 0, Level: 0, Recipe: 0, Time: 0, Category: 0};

var svg = d3.select("#calculator").append("svg")
        .attr("width", width)
        .attr("height", height);

var tooltip = d3.select("#calculator").append("div").attr("class", "tooltip hidden");
var categorytip = d3.select("#calculator").append("div").attr("class", "categorytip hidden");
var chars = svg.append("g").attr("id", "chars");
var result = svg.append("g").attr("id", "result");
var main = svg.append("g").attr("id", "main");

var weapons = d3.select("#attack");
var protections = d3.select("#defence");
var supportives = d3.select("#extra");

var Slider = main.append("g").attr("id", "slider");
var level = main.append("g");
var currentDamage = main.append("g");
var allDamage = d3.select("#total");
var attack = main.append("g").attr("id", "attack");
var defence = main.append("g").attr("id", "defence");
var extra = main.append("g").attr("id", "extra");
var levels = new Array();
var ressources = new Array();
var workers = new Array();
var krowns = new Array();
var categories = new Array();
var results = new Array();
var resultRect = new Array();
var weaponsByCustomer = d3.map(), protectionsByCustomer = d3.map(), supportivesByCustomer = d3.map();
var weaponsById = d3.map(), protectionsById = d3.map(), supportivesById = d3.map(), customerById = d3.map();
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
function itemOrderBy(prop) {
    if (orderState[prop] === 0 || orderState[prop] === -1)
        orderState[prop] = 1;
    else
        orderState[prop] = -1;
    if (prop !== "Recipe") {
        weaponsByCustomer.forEach(function (d, i) {
            i.sort(function (a, b) {
                if (a[prop] < b[prop])
                    return 1 * orderState[prop];
                if (a[prop] > b[prop])
                    return -1 * orderState[prop];
                return 0;
            });
        });
        protectionsByCustomer.forEach(function (d, i) {
            i.sort(function (a, b) {
                if (a[prop] < b[prop])
                    return 1 * orderState[prop];
                if (a[prop] > b[prop])
                    return -1 * orderState[prop];
                return 0;
            });
        });
        supportivesByCustomer.forEach(function (d, i) {
            i.sort(function (a, b) {
                if (a[prop] < b[prop])
                    return 1 * orderState[prop];
                if (a[prop] > b[prop])
                    return -1 * orderState[prop];
                return 0;
            });
        });
    } else {
        weaponsByCustomer.forEach(function (d, i) {
            i.sort(function (a, b) {
                if (a[prop].substring(a[prop].indexOf("*") + 1) < b[prop].substring(b[prop].indexOf("*") + 1))
                    return 1 * orderState[prop];
                if (a[prop].substring(a[prop].indexOf("*") + 1) > b[prop].substring(b[prop].indexOf("*") + 1))
                    return -1 * orderState[prop];
                return 0;
            });
        });
        protectionsByCustomer.forEach(function (d, i) {
            i.sort(function (a, b) {
                if (a[prop].substring(a[prop].indexOf("*") + 1) < b[prop].substring(b[prop].indexOf("*") + 1))
                    return 1 * orderState[prop];
                if (a[prop].substring(a[prop].indexOf("*") + 1) > b[prop].substring(b[prop].indexOf("*") + 1))
                    return -1 * orderState[prop];
                return 0;
            });
        });
        supportivesByCustomer.forEach(function (d, i) {
            i.sort(function (a, b) {
                if (a[prop].substring(a[prop].indexOf("*") + 1) < b[prop].substring(b[prop].indexOf("*") + 1))
                    return 1 * orderState[prop];
                if (a[prop].substring(a[prop].indexOf("*") + 1) > b[prop].substring(b[prop].indexOf("*") + 1))
                    return -1 * orderState[prop];
                return 0;
            });
        });
    }
    if (current.customer) {//newChar(current.customer);
        d3.select("#calculator").selectAll("li").remove();
        reloadItems(current.customer.id, weapons, weaponsByCustomer, attack, "attack", 60);
        reloadItems(current.customer.id, protections, protectionsByCustomer, defence, "defence", 200);
        reloadItems(current.customer.id, supportives, supportivesByCustomer, extra, "extra", 340);
    }
    d3.select("#time").html(function () {
        return orderState.Time === 1 ? "Crafting Time &#x25B2;" : orderState.Time === -1 ? "Crafting Time &#x25BC;" : "Crafting Time";
    }).classed("buttonLast", function(){
        return (prop === "Time");
    });
    d3.select("#category").html(function () {
        return orderState.Category === 1 ? "Category &#x25B2;" : orderState.Category === -1 ? "Category &#x25BC;" : "Category";
    }).classed("buttonLast", function(){
        return (prop === "Category");
    });
    d3.select("#price").html(function () {
        return orderState.Price === 1 ? "Price &#x25B2;" : orderState.Price === -1 ? "Price &#x25BC;" : "Price";
    }).classed("buttonLast", function(){
        return (prop === "Price");
    });
    d3.select("#level").html(function () {
        return orderState.Level === 1 ? "Level &#x25B2;" : orderState.Level === -1 ? "Level &#x25BC;" : "Level";
    }).classed("buttonLast", function(){
        return (prop === "Level");
    });
    d3.select("#recipe").html(function () {
        return orderState.Recipe === 1 ? "Recipe &#x25B2;" : orderState.Recipe === -1 ? "Recipe &#x25BC;" : "Recipe";
    }).classed("buttonLast", function(){
        return (prop === "Recipe");
    });
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
function writePermaLink() {
    d3.select("#perma").attr("value", permaLink).classed("hidden", false);
    d3.select("#permalink").classed("lifted", true);
}
function permaLink() {
    var permalink = window.location.origin + window.location.pathname + "?b=";
    for (var i = 0; i < 10; i++) {
        if (R[i] !== 'z') {
            permalink += R[i].customer.i + String.fromCharCode(R[i].customer.level + 96) +
                    (R[i].attack.i || 'zz') +
                    (R[i].defence.i || 'zz') +
                    (R[i].extra.i || 'zz');
        }
    }
    if (permalink === window.location.origin + window.location.pathname + "?b=")
        permalink = window.location.origin + window.location.pathname;
    return permalink;
}
function loadBuild(permalink) {
    if (permalink.length % 8 !== 0)
        window.alert("Miss-formated permalink :/ Would you please verify your link?");
    var charz = permalink.length / 8;
    for (var i = 0; i < charz; i++) {
        var toLoad = {customer: null, attack: {Price: null}, defence: {Price: null}, extra: {Price: null}};
        toLoad.customer = customerById.get(permalink[0]);
        toLoad.customer.level = parseInt(permalink[1], 32) - 9;
        toLoad.customer.baseDamage = levels[toLoad.customer.level];
        if ((permalink[2] + permalink[3]) !== 'zz')
            toLoad.attack = weaponsById.get(permalink[2] + permalink[3]);
        if ((permalink[4] + permalink[5]) !== 'zz')
            toLoad.defence = protectionsById.get(permalink[4] + permalink[5]);
        if ((permalink[6] + permalink[7]) !== 'zz')
            toLoad.extra = supportivesById.get(permalink[6] + permalink[7]);
        R[i] = JSON.parse(JSON.stringify(toLoad));
        send(i, toLoad);
        permalink = permalink.slice(8);
    }
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
    t
            .on("mousemove", function () {
                var mouse = d3.mouse(svg.node()).map(function (d) {
                    return parseInt(d);
                });
                tooltip.classed("hidden", false)
                        .attr("style", "left:" + (mouse[0] + 10) + "px;top:" + (mouse[1] + 10) + "px")
                        .html("<ul><li><img style='display:block;' width='53' height='53' src='" + workers[d.Worker] +
                                "'></li><li><img src='images/" + duration(d.Time) +
                                "' ></li></ul><ul><li style='color:#a0a0ff;font-weight:bold;'>Damage : " + Math.floor(Math.sqrt(d.Price)) +
                                "</li><li>" + d.Price +
                                " $ </li><li>" + d.Category +
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
            .on("click", function () {
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
    var t = pvp.transition()
            .duration(1500).delay(750)
            .each(highlight);
    function highlight() {
        var p = d3.select(this);
        (function repeat() {
            p = p.transition()
                    .attr("x", 396)
                    .attr("y", 400)
                    .attr("width", 126)
                    .attr("height", 110)
                    .transition()
                    .attr("x", 391)
                    .attr("y", 396)
                    .attr("width", 136)
                    .attr("height", 118)
                    .each("end", repeat);
        })();
    }
    pvp.on("click", function () {
        slider.interrupt().transition();
        var position = R.indexOf('z');
        if (position === -1) {
            window.alert("you can only send 10 customers");
        }
        R[position] = JSON.parse(JSON.stringify(current));
        send(position, current);
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
function send(position, current) {
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
                        .html("<ul><li><img style='display:block;' width='53' height='53' src='" + workers[d.Worker] +
                                "'></li><li><img src='images/" + duration(d.Time) +
                                "' ></li></ul><ul><li style='color:#a0a0ff;font-weight:bold;'>Damage : " + Math.floor(Math.sqrt(d.Price)) +
                                "</li><li>" + d.Price +
                                " $ </li><li>" + d.Category +
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
    var krown = 0;
    var price = 0;
    for (var i = 0; i < 10; i++) {
        if (R[i] !== 'z') {
            price += Math.round(breakChance(R[i].customer.level, R[i].attack.Level) * R[i].attack.Price +
                    breakChance(R[i].customer.level, R[i].defence.Level) * R[i].defence.Price +
                    breakChance(R[i].customer.level, R[i].extra.Level) * R[i].extra.Price);
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
    var rest = total;
    for (var i = 0; i < krowns.length; i++) {
        rest = rest - krowns[i];
        if (rest >= 0) {
            krown += 5;
        } else {
            break;
        }
        if (i + 1 === krowns.length) {
            krown += Math.floor(rest / 2000) * 5;
        }
    }
    allDamage.selectAll("div").remove();
    allDamage
            .html(
                    "<div id='metrics'>" +
                    "<div id='krowns'><img src='images/krowns.png'> X " + krown +
                    "</div><div id='gold'><img id='cost' title='The Average cost of your Klash deduced from the break chances.' src='images/gold.png'> " + price +
                    "</div>" +
                    "</div>" +
                    "<div id='damage'><div id='fighter-total'>" + fighter +
                    "</div><div id='rogue-total'>" + rogue +
                    "</div><div id='caster-total'>" + caster +
                    "</div><div id='totalDamage'>Damage : " + total + "</div>" +
                    "</div>");
}
function breakChance(level, itemLevel) {
    if (!itemLevel)
        return 0;
    var breaks = [0.1, 0.25, 0.5, 0.9];
    var i = 0;
    if (itemLevel - level < 0) {
        i = 0;
    } else if (itemLevel - level > 3) {
        i = 3;
    } else {
        i = itemLevel - level;
    }
    return breaks[i];
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
totalDamage();
var char = main.append("g").attr("id", "mainImage");
d3.json("json/data.json", function (data) {
    levels = data.game.levels;
    ressources = data.game.ressources;
    workers = data.game.worker;
    categories = data.game.category;
    krowns = data.game.krowns;
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
                    return "#ea6666";
                else if (d.class === "rogue")
                    return "#ffd066";
                else if (d.class === "caster")
                    return "#77e977";
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
            .on("mousemove", function (d) {
                var mouse = d3.mouse(svg.node()).map(function (d) {
                    return parseInt(d);
                });
                categorytip.classed("hidden", false)
                        .attr("style", "left:" + (mouse[0] + 16) + "px;top:" + (mouse[1] - 160) + "px")
                        .html(function () {
                            var r = "<div>";
                            d.weapons.forEach(function (cat) {
                                r += "<img src='images/items/categories/" + categories[cat] + "'>";
                            });
                            r += "</div><div>";
                            d.protections.forEach(function (cat) {
                                r += "<img src='images/items/categories/" + categories[cat] + "'>";
                            });
                            r += "</div><div>";
                            d.supportive.forEach(function (cat) {
                                r += "<img src='images/items/categories/" + categories[cat] + "'>";
                            });
                            r += "</div>";
                            return r;
                        });
            })
            .on("mouseout", function () {
                categorytip.classed("hidden", true);
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
    if (window.location.search.slice(3)) {
        //var weaponsById = d3.map(), protectionsById = d3.map(), supportivesById = d3.map(), customerById = d3.map();
        var att = [], def = [], ext = [];
        for (var key in data.game.items.weapons) {
            att = att.concat(data.game.items.weapons[key]);
        }
        for (var key in data.game.items.protections) {
            def = def.concat(data.game.items.protections[key]);
        }
        for (var key in data.game.items.supportive) {
            ext = ext.concat(data.game.items.supportive[key]);
        }
        for (var i = 0; i < data.game.chars.length; i++) {
            customerById.set(data.game.chars[i].i, data.game.chars[i]);
        }
        for (var i = 0; i < att.length; i++) {
            weaponsById.set(att[i].i, att[i]);
        }
        for (var i = 0; i < def.length; i++) {
            protectionsById.set(def[i].i, def[i]);
        }
        for (var i = 0; i < ext.length; i++) {
            supportivesById.set(ext[i].i, ext[i]);
        }
        loadBuild(window.location.search.slice(3));
    }
});