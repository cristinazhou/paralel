var width = 700,
    height = 700,
    padding = {
        left: 20,
        right: 20
    };
var x1 = new Set(),
    x2 = new Set(),
    x3 = new Set(),
    x4 = new Set();
var array1 = [],
    array2 = [],
    array3 = [],
    array4 = [];
var head = [];
var tbody, thead,sData;
var lines, nodes;
var sdepartment, sport, dport, department;
var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("test.json", function (json) {
    tbody = json.tbody;
    thead = json.thead;
    thead.forEach(function (data) {
        head.push(data);
    }) //生成图例
    tbody.forEach(function(data){
        array1.push(data[0]);
        array2.push(data[1]);
        array3.push(data[2]);
        array4.push(data[3]);
    })
    var ans1 = countStatics(array1);
    var ans2 = countStatics(array2);
    var ans3 = countStatics(array3);
    var ans4 = countStatics(array4);
    console.log(ans1);
    tbody.forEach(function (data) {
        x1.add(data[0]);
        x2.add(data[1]);
        x3.add(data[2]);
        x4.add(data[3]);
    }) //生成各轴的节点
    change(x1,array1);
    change(x2,array2);
    change(x3,array3);
    change(x4,array4);

    sdepartment = tbody.map(arr => arr[0]);
    sport = tbody.map(arr => arr[1]);
    dport = tbody.map(arr => arr[2]);
    department = tbody.map(arr => arr[3]);
    render(tbody);
//  tbody = filterNodes(tbody,'奇舞团',0);
//  console.log(tbody);
//  render(tbody);
});
function change(arr1,arr2){
    for(let x of arr1){

    }


}

function countStatics(arr) {
    var len = arr.length,
        ans = {};
    for (var i = 0; i < len; i++) {
        var temp = arr[i];
        if (!ans[temp]) ans[temp] = 1;
        else ans[temp]++;
    }
    return ans;
} //统计频次

function gendots(x, countObj, scale, start,direct=1) {
    var ans = [],last;
    ans.push({x:start,y:0})
    for (var item of x) {
        var temp = {};
        temp.x = start-countObj[item]*10*direct;
        last = temp.y = scale(item);
        ans.push(temp);
    }
    ans.push({x:start,y:last});
    return ans;
}//生成频次点坐标

function filterNodes(tbody,nodes,axis){
    let ans = [];
    if(Array.isArray(nodes)){
        nodes.forEach(function(node){
            ans.concat( tbody.filter(function(d){
               return d[axis] === node;
            })); 
        })
    }else{
        ans = tbody.filter(function(d){
            //console.log(d[axis], nodes);
             return d[axis] === nodes;
        })
    }
    return ans;
}

function render(tbody) {
    //console.log(sdepartment,sport,dport,department); 
    var cSdepartment = countStatics(sdepartment);
    var cSport = countStatics(sport);
    var cDport = countStatics(dport);
    var cDepartment = countStatics(department);
    //console.log(cSdepartment,cSport,cDport,cDepartment);
    svg.append("g")
        .append("text")
        .text(thead[0])
        .attr("class","head")
        .attr("x",17)
        .attr("transform", function (d, i) {
            return "translate(0,-10)"; })

    svg.append("g")
        .append("text")
        .text(thead[1])
        .attr("class","head")
        .attr("x",178)
        .attr("transform", function (d, i) {
            return "translate(0,-10)"; })
    svg.append("g")
        .append("text")
        .text(thead[2])
        .attr("class","head")
        .attr("x",345)
        .attr("transform", function (d, i) {
            return "translate(0,-10)"; })
    svg.append("g")
        .append("text")
        .text(thead[3])
        .attr("class","head")
        .attr("x",510)
        .attr("transform", function (d, i) {
            return "translate(0,-10)"; })

    var scale1 = d3.scaleOrdinal()
        .domain(Array.from(x1))
        .range(scaleRange(x1))
    var scale2 = d3.scaleOrdinal()
        .domain(Array.from(x2))
        .range(scaleRange(x2))
    var scale3 = d3.scaleOrdinal()
        .domain(Array.from(x3))
        .range(scaleRange(x3))
    var scale4 = d3.scaleOrdinal()
        .domain(Array.from(x4))
        .range(scaleRange(x4))
    var axis1 = d3.axisLeft()
        .scale(scale1)
        .ticks(5)
    var axis2 = d3.axisLeft()
        .scale(scale2)
        .ticks(5)
    var axis3 = d3.axisRight()
        .scale(scale3)
        .ticks(5)
    var axis4 = d3.axisRight()
        .scale(scale4)
        .ticks(5);

    var dots1 = gendots(x1, cSdepartment, scale1,40);
    var dots2 = gendots(x2, cSport, scale2,200);
    var dots3 = gendots(x3, cDport, scale3,360,-1);
    var dots4 = gendots(x4, cDepartment, scale4,520,-1);
    var dots = [dots1,dots2,dots3,dots4];
    //console.log(dots1);

    function scaleRange(arr) {
        var b = [0];
        for (var i = 1,len = arr.size; i < len; i++) {
            b.push(700 /(len-i));
        }
        return b;
    }
    var line = d3.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        }); //直线生成器
        
    var leftHalf = [dots[0],dots[1]];
    var rightHalf = [dots[2],dots[3]];
    leftHalf.forEach(function(data){
        svg .append('svg:path')
            .attr('d', line(data))
            .attr('stroke','pink')
            .attr('fill', 'pink');
    })
    rightHalf.forEach(function(data){
        svg .append('svg:path')
            .attr('d', line(data))
            .attr('stroke','blue')
            .attr('fill', '#6C9BD2');
    })
    
    svg.append("g").call(axis1).attr("transform", function (d, i) {
        return "translate(" + (40 + 160 * i) + ")";})
        .attr("class", "trait")



    //.data(['z'])
    svg.append("g").call(axis2).attr("transform", function (d, i) {
            return "translate(200)"; })
        .attr("class", "trait")
    svg.append("g").call(axis3).attr("transform", function (d, i) {
            return "translate(360)";})
        .attr("class", "trait")
    svg.append("g").call(axis4).attr("transform", function (d, i) {
            return "translate(520)"; })
        .attr("class", "trait")
        .append("svg:text")
        .data(thead[3])

    tbody.forEach(function (data) {
        svg.append('svg:path')
            .attr('d', line([{
                    x: 40,
                    y: scale1(data[0])
                },
                {
                    x: 200,
                    y: scale2(data[1])
                },
                {
                    x: 360,
                    y: scale3(data[2])
                },
                {
                    x: 520,
                    y: scale4(data[3])
                }
            ]))
            .attr('stroke', function (d, i) {
                return color(i);
            })
            .attr('fill', 'none')
    })
    // lines = svg.selectAll("path.node")
    //         .data(tbody, function (d) {
    //             return d.name;
    //         })
    //         .enter().append("path")
    //         .attr("class", "node")
    //         .style("stroke", function (d, i) {
    //             return color(i);
    //         });
    tbody = filterNodes(tbody,'奇舞团',0);
    //console.log(tbody);
    var brush = svg.selectAll('g.trait')
                .attr("class", "brush")
                .call(d3.brush()
                .extent([[-30, 0], [30, height]])
                .on("end", brushed));
    function brushed() {
        //过滤数据并重新渲染
        var selection = d3.event.selection;
        //lines.classed("selected", selection);
        console.log(selection[0],selection[1]);
    }
}
