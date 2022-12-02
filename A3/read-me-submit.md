# Dusan Popovic

# VIS Assignment 3

Implemented using React. Project initialized with npm init react-app vis. Built with npm run build. Start with npm start. Bootstrap added using npm install bootstrap.
Use npm install to install all the required packages for dev environment.

The data is first loaded and transformed into one data object, with similar structure to hte one in the last assignment. The new structure makes it easier to make the scatter plot.

Communication between the slider, scatter and choropleth components is done mostly using the useState react hook and passing the required variables back and forth. By filtering only on the passed year, one set of dots is plotted per slider position. In the same way, the choropleth colours are determined. For the actual colour calculation, the position of each dot is compared to size of one colour block and the correct corresponding golour is selected from the globals object.

The globals object is used to store and pass the absolute values suzch as colour values, padding sizes, etc. to all the components using the useContext hook.

Dot mouse over has been implemented in the same way as in assignment 2. The same hidden property has been used to make the selected dot more visible (utilizing css has()).

When brushing, the dot coordinate values are checked against the brush boundries and the relevant dots have their class changed to appear selected. Highlighting colours on the choropleth left out due to time concerns.
