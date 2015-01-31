var width = 960,
        height = 600;

var R = new Array();

var svg = d3.select("#calculator").append("svg")
        .attr("width", width)
        .attr("height", height);

var chars = svg.append("g").attr("id", "chars");

var items = svg.append("g").attr("id", "items");
var attak, defence, extra;
var weapons, protections, supportives;
items.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 300)
        .attr("height", 184)
        .attr("fill", "rgba(200, 200, 200, 0.2)")
        .attr("stroke", "#000")
        .attr("stroke-width", "2");
items.append("rect")
        .attr("x", 0)
        .attr("y", 184)
        .attr("width", 300)
        .attr("height", 184)
        .attr("fill", "rgba(200, 200, 200, 0.2)")
        .attr("stroke", "#000")
        .attr("stroke-width", "2");
items.append("rect")
        .attr("x", 0)
        .attr("y", 368)
        .attr("width", 300)
        .attr("height", 184)
        .attr("fill", "rgba(200, 200, 200, 0.2)")
        .attr("stroke", "#000")
        .attr("stroke-width", "2");

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
        .attr("x", 520)
        .attr("y", 100)
        .attr("width", 160)
        .attr("height", 160)
        .attr("fill", "rgba(200, 200, 200, 0.2)")
        .attr("stroke", "#000")
        .attr("stroke-width", "2");
var char = main.append("g").attr("id", "mainImage");

var weaponsByCustomer = d3.map(), protectionsByCustomer = d3.map(), supportiveByCustomer = d3.map();

function load() {
    return 1;
}

function reloadItems(customer) {
    items.selectAll("text").remove();
    weapons = items.selectAll(".weapons")
            .data(weaponsByCustomer.get(customer))
            .enter().append("text")
            .html(function (d) {
                console.log(d);
                return d.Recipe;
            })
            .attr("y", function (d, i) {
                return i * 22;
            })
            .attr("x", 0);
    protections = items.selectAll(".protections")
            .data(protectionsByCustomer.get(customer))
            .enter().append("text")
            .html(function (d) {
                console.log(d);
                return d.Recipe;
            })
            .attr("y", function (d, i) {
                return 184 + i * 22;
            })
            .attr("x", 0);
    supportives = items.selectAll(".supportives")
            .data(supportiveByCustomer.get(customer))
            .enter().append("text")
            .html(function (d) {
                console.log(d);
                return d.Recipe;
            })
            .attr("y", function (d, i) {
                return 368 + i * 22;
            })
            .attr("x", 0);
}

d3.json("json/data.json", function (data) {
    console.log(data);
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
                    console.log(d.protections[j]);
                    for (var k = 0; k < data.game.items.protections[d.protections[j]].length; k++)
                    map.push(data.game.items.protections[d.protections[j]][k]);
                }
                protectionsByCustomer.set(d.id, map);
                
                var map = new Array();
                for (var j = 0; j < d.supportive.length; j++) {
                    for (var k = 0; k < data.game.items.supportive[d.supportive[j]].length; k++)
                    map.push(data.game.items.supportive[d.supportive[j]][k]);
                }
                supportiveByCustomer.set(d.id, map);
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
    console.log(weaponsByCustomer.get("channeler"));
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
                char.selectAll("image").remove();
                char.append("image")
                        .attr("x", 520)
                        .attr("y", 100)
                        .attr("width", 159)
                        .attr("height", 159)
                        .attr("xlink:href", "images/chars/" + d.image);
            });
});