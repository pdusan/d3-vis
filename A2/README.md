# VIS Assignment 2 - Dusan Popovic 01651258

All the functionality has been split into its corresponding files (html, css and js), with the main part of the assignment
located in vis.js.
Using d3, the provided data set is loaded in and then transformed into an array of objects of the form:
<code>
            {
                fertility: "country",
                values: [
                    {
                        year: "year",
                        fertility: "fertility"
                    }
                ]
            }
</code>
This makes for easier plotting, as each country would have a corresponding fertility-year pair.
The data is scaled across the x and y axes and the x axis ticks formated accordingly.
A clip path has been added to make the chart look nicer after brushing. The lines are then plotted as normal.
The relevant hover and mouse click functions have then been added, with the text label height being determined by the first fertility value for each country,
this makes sure that the text label always shows next to the corresponding country (the svg is not adaptable, so the labels may overlap the lines on narrow screens).
For the mouse click highlight, colour changes and text label additions / removals are done by tracking element ids.

For better visibility when mousing over / selecting a country, the colour and opacity changes are done by manipulating the classes of the relevant lines and changing their attributes by using the css :has() selector (can be seen in style.css). This should work on current versions of Chrome and Firefox.

The brushable context area was added below the main chart. After each brush, the x axis ticks are reformatted, so that the correct ammount of ticks is displayed. 
Before each brush action, the xScale domain is reset, so that the correct selection area is always shown. Double clicking the brushable area resets the line chart.

As with the first assignment, I did not copy any code directly from my last year's assignment. Some parts are however similar, as I could only think of a limited amount of ways to tackle some aspects, namely the clip path, focus and data restructuring parts. 