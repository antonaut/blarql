            var jsonTest =
            [
    {
        type:"uri",
        value:"http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing",
        size:10,
        name:"http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing"
    },
    {
        type:"uri",
        value:"http://dbpedia.org/resource/United_States_Congress",
        size:10,
        name:"http://dbpedia.org/resource/United_States_Congress",
        imports:[
            "http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing",
            "http://www.w3.org/2002/07/owl#Thing",
            "http://schema.org/Organization",
            "http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#Agent",
            "http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#SocialPerson",
            "http://dbpedia.org/ontology/Agent",
            "http://dbpedia.org/ontology/Legislature",
            "http://dbpedia.org/ontology/Organisation",
            "http://umbel.org/umbel/rc/GovernmentalOrganization",
            "http://umbel.org/umbel/rc/Organization",
            "http://dbpedia.org/class/yago/Abstraction100002137",
            "http://dbpedia.org/class/yago/Assembly108163792",
            "http://dbpedia.org/class/yago/BicameralLegislatures",
            "http://dbpedia.org/class/yago/Gathering107975026",
            "http://dbpedia.org/class/yago/Group100031264",
            "http://dbpedia.org/class/yago/Legislature108163273",
            "http://dbpedia.org/class/yago/SocialGroup107950920",
            "http://dbpedia.org/class/yago/NationalLegislatures",
            "http://dbpedia.org/resource/Category:1789_establishments_in_the_United_States",
            "http://dbpedia.org/resource/Category:Bicameral_legislatures",
            "http://dbpedia.org/resource/Category:Legislative_branch_of_the_United_States_government",
            "http://dbpedia.org/resource/Category:National_legislatures",
            "http://wifo5-03.informatik.uni-mannheim.de/flickrwrappr/photos/United_States_Congress",
            "http://www.house.gov/",
            "http://www.senate.gov/",
            "http://baic.house.gov/",
            "http://bensguide.gpo.gov/9-12/lawmaking/index.html",
            "http://thomas.loc.gov/",
            "http://womenincongress.house.gov/",
            "http://www.eric.ed.gov/ERICWebPortal/Home.portal?_nfpb=true&ERICExtSearch_SearchValue_0=Vontz&ERICExtSearch_SearchType_0=authors&_pageLabel=RecordDetails&objectId=0900000b801b5845",
            "http://www.opencongress.org/",
            "http://www.tell-usa.org/totl/07-%20Accountability,%20Efficiency%20&%20Cuts.htm#Committee_autonomy",
            "http://www.wrhammons.com/us-senators-representatives.htm",
            "http://ucblibraries.colorado.edu/govpubs/us/congress.htm",
            "http://www.house.gov/",
            "http://www.infoplease.com/spot/womensfirsts1.html",
            "http://www.senate.gov/",
            "http://www.senate.gov/artandhistory/history/common/generic/Senate_Historical_Office.htm",
            "http://www.llsdc.org/attachments/wysiwyg/544/sess-cong.pdf",
            "http://www.llsdc.org/crs-congress/",
            "http://www.thegreenpapers.com/Hx/SessionsExplanation.html",
            "http://dbpedia.org/resource/United_States_House_of_Representatives",
            "http://dbpedia.org/resource/United_States_Senate",
            "s282",
            "http://dbpedia.org/resource/Joe_Biden",
            "http://dbpedia.org/resource/Patrick_Leahy",
            "http://dbpedia.org/resource/John_Boehner",
            "http://dbpedia.org/resource/Vice_President_of_the_United_States",
            "http://dbpedia.org/resource/President_pro_tempore_of_the_United_States_Senate",
            "http://dbpedia.org/resource/Speaker_of_the_United_States_House_of_Representatives",
            "s290",
            "http://dbpedia.org/resource/United_States_Capitol",
            "http://dbpedia.org/resource/Washington,_D.C.",
            "http://dbpedia.org/resource/United_States",
            "http://www.house.gov/",
            "http://www.senate.gov/",
            "http://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_the_Unites_States_Congress.svg",
            "http://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_the_Unites_States_Congress.svg?width=300",
            "http://dbpedia.org/resource/United_States_House_of_Representatives",
            "http://dbpedia.org/resource/United_States_Senate",
            "s282",
            "http://dbpedia.org/resource/Joe_Biden",
            "s551",
            "http://dbpedia.org/resource/United_States_Capitol",
            "http://dbpedia.org/resource/Washington,_D.C.",
            "http://dbpedia.org/resource/United_States",
            "http://dbpedia.org/resource/Republican_Party_(United_States)",
            "http://dbpedia.org/resource/Democratic_Party_(United_States)",
            "http://dbpedia.org/resource/Independent_(politician)",
            "http://dbpedia.org/resource/Democratic_Party_(United_States)",
            "http://dbpedia.org/resource/Bicameralism",
            "http://en.wikipedia.org/wiki/United_States_Congress?oldid=605706837",
            "http://en.wikipedia.org/wiki/United_States_Congress"
        ]
    },
    {
        type:"uri",
        value:"http://www.w3.org/2002/07/owl#Thing",
        size:10,
        name:"http://www.w3.org/2002/07/owl#Thing"
    }
    ] ;
            // SLIDER FOR DISPLAYING DIFFERENT DEPTHS
            var slider = d3.select("body").append("input")
                            .attr("type","range")
                            .attr("min","0")
                            .attr("max","10")
                            .attr("value", "10")
                            .attr("step", "1")
                            .attr("onchange","sliderUpdate(this.value)");
            var range = d3.select("body").append("span")
                          .attr("id","range");
            function sliderUpdate(v)
            {
                document.getElementById("range").innerHTML=v;
                node.filter(function (n) { return n }).attr('class', 'node');
                node.filter(function(n)
                {
                        //console.log(n.depth);
                        if (n.depth >= v)
                        {
                            return n;
                            //node.classed("too-deep", n);
                            // n.classed("class","too-deep");
                        }
                }).attr('class','too-deep');
            }
            // Circle diameter and radius
            var diameter = 2048,
            radius = diameter / 2,
            innerRadius = radius - 250;
            // comparator for cluster
            function comparator(a, b)
            {
              return d3.ascending(a.name, b.name);
            }
            // create a D3 cluster
            var cluster = d3.layout.cluster()
            .size([360, innerRadius]) // make it a full circle
            .sort(comparator) // no sorting in result
            .value
            (
                function(d)
                {
                    return d.size;
                }
            );
             
             // D3 bundle
            var bundle = d3.layout.bundle();
             
            var line = d3.svg.line.radial()
            .interpolate("bundle") // Normal : bundle, with tension (below) / cardinal / basis / etc.
            .tension(.2) // change tension
            .radius(function(d)
                { return d.y; }
            )
            .angle(function(d)
                { return d.x / 180 * Math.PI; }
            );
            
            // creation of svg panel for the graph
            var svg = d3.select("body").append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");
             
            var link = svg.append("g").selectAll(".link"),
            node = svg.append("g").selectAll(".node");
             	
	function loadGraph()
		{          d3.json("./js/tmp.json", function(error, classes)
            {
                //console.log(classes);
                var nodes = cluster.nodes(packageHierarchy(classes)),
                //var nodes = jsonTest,
                links = packageImports(nodes);
             
                link = link
                .data(bundle(links))
                .enter().append("path")
                .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
                .attr("class", "link")
                .attr("d", line);
             
                node = node
                .data(nodes.filter(function(n) { return !n.children; }))
                //.data(jsonTest)
                .enter().append("text")
                .attr("class", "node")
                .attr("dy", ".31em")
                .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
                .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                .text(function(d) { return d.key; })
                .on("click", mouseclicked)
                .on("mouseover", mouseovered)
                .on("mouseout", mouseouted);
                console.log(nodes);
            });
} // loadGraph             
            function mouseovered(d)
            {
                node
                .each(function(n)
                {
                    n.target = n.source = false;
                });
                 
                link
                .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
                .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
                .filter(function(l) { return l.target === d || l.source === d; })
                .each(function() { this.parentNode.appendChild(this); });
                 
                node
                .classed("node--target", function(n) { return n.target; })
                .classed("node--source", function(n) { return n.source; });
            }
            // On click on a node, open link and change color of the node
            function mouseclicked(d)
            {
				if(d.type === 'uri'){
					window.open(d.link);
				}
                console.log(d);
            }
            function mouseouted(d)
            {
                link
                .classed("link--target", false)
                .classed("link--source", false);
                 
                node
                .classed("node--target", false)
                .classed("node--source", false);
            }
    
            d3.select(self.frameElement).style("height", diameter + "px");
             
            // Lazily construct the package hierarchy from class names.
            function packageHierarchy(classes)
            {
                var map = {};
             
                function find(name, data)
                {
                    var node = map[name], i;
                    if (!node)
                    {
                        node = map[name] = data || {name: name, children: []};
                        if (name.length)
                        {
                            node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                            node.parent.children.push(node);
                            node.key = name.substring(i + 1);
                        }   
                    }
                    return node;
                }
             
                classes.forEach(function(d)
                {
                    find(d.name, d);
                });
                return map[""];
            }
            // Return a list of imports for the given array of nodes.
            function packageImports(nodes)
            {
                var map = {},
                imports = [];
             
                // Compute a map from name to node.
                nodes.forEach(function(d)
                {
                    map[d.name] = d;
                });
             
                // For each import, construct a link from the source to target node.
                nodes.forEach(function(d)
                {
                    if (d.imports) d.imports.forEach(function(i)
                    {
                        imports.push({source: map[d.name], target: map[i]});
                    });
                });
             
                return imports;
            }
      
