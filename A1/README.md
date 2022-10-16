# VIS Assignment 1 - Dusan Popovic 01651258

All the functionality has been split into its corresponding files (html, css and js), with the main part of the assignment
located in vis.js.

Using d3, the provided data set is loaded in and the resulting bar chart is displayed.

Scaling on the Y axis has been done with a linear scale, with the domain extended a little, so that the highest visitor count doesn't just end at the top of the axis
which helps us in seeing the actual highest number of visitors.

The X Axis has been scaled useing a band scale, determined by the width of the svg element.

The resulting bars are then drawn, their height determined by scaling the number of visitors with the yScale.

The required lables have been attached to the svg element and positioned around the chart.

Additional Note:
I have already done this assignment last year (had no issues with it back then) and I wanted to make this one witout referencing the old one at all (mostly just for coding practice). I didn't take any code from my old assignment, but since there's really a limited number of ways one can make a bar chart like this, some parts might be very similar, I hope this won"t be an issue.
