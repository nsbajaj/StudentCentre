import { Component, OnInit, Input, DoCheck } from '@angular/core';

import { Course } from './dataModelClasses';

// Locally-used class that describes the properties
// of an object used to render a timetable cell
class GridCell {
  cellNumber: number;
  courseCode: string;
  section: string;
  termSectionId: number;
  professor: string;
  cellColour: string;
}

@Component({
  selector: 'app-cart-selected-grid',
  templateUrl: './cart-selected-grid.component.html',
  styleUrls: ['./cart-selected-grid.component.css']
})
export class CartSelectedGridComponent implements OnInit, DoCheck {

  // Properties
  // ############################################################

  // Passed-in collection of courses selected
  @Input()
  coursesSelected: Course[];

  // A copy of coursesSelected, for the user interface, with additional property
  coursesSelectedForUI: any[];

  // Collection used to render the timetable grid
  gridCells: GridCell[][];

  // Initialization
  // ############################################################

  constructor() {

    // Set initial values
    this.clearGrid();
    this.coursesSelectedForUI = [];
  }

  ngOnInit() { }

  // We must act upon changes to the contents of coursesSelected
  // We cannot use OnChanges, because it compares bound-property values by reference,
  // and the reference to the coursesSelected array doesn't change, but its contents do
  // Here, we must use DoCheck, which gets called any time that any value changes
  ngDoCheck() {

    // Prepare the collection to be rendered in the UI
    this.coursesSelectedForUI = [];
    // Copy the incoming collection, and add new property to each object
    // Uses the JavaScript "spread" syntax
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals
    this.coursesSelected.forEach(c => {
      this.coursesSelectedForUI.push({ ...c, gridCells: this.getPeriods(c) });
    });
    // Sort the result
    this.coursesSelectedForUI.sort((a, b) => a.gridCells[0] - b.gridCells[0]);

    // Render the timetable grid
    this.updateGrid();
    // console.log("Length of Courses Selected: " + this.coursesSelected.length);
    // console.log("Length of UI Courses Selected: " + this.coursesSelectedForUI.length);
    // console.log("Length of Grid Cells: " + this.gridCells.length);
    // for(var i = 0; i < this.gridCells.length; i++){
    //   console.log("I: " + i + ", Size: " + this.gridCells[i].length);
    // }
    // console.log("----------");
  }


  // Class methods
  // ############################################################

  // Clear the grid of any data
  clearGrid(): void {

    this.gridCells = [];
    for (let i = 0; i < 75; i++) {
      this.gridCells.push([]);
    }
  }

  // Update the grid with data from the coursesSelected collection
  updateGrid(): void {

    this.clearGrid();

    // Go through the courses
    this.coursesSelectedForUI.forEach((c, i) => {

      let periods = this.getPeriods(c);

      // Each course has a "periods" collection, which represents
      // the periods on the grid that they are intended for
      periods.forEach(p => {

        // Configure the cell with data
        let gc = new GridCell();
        gc.cellNumber = p;
        gc.courseCode = c.courseCode;
        gc.section = c.section;
        gc.termSectionId = c.termSectionId;
        gc.professor = c.professor;
        gc.cellColour = `bgclr${i}`

        // Add the cell to the collection that's bound to the UI
        this.gridCells[p].push(gc);
      });
    });
  }

  // This determines the timetable period numbers, which are used for sorting and displaying
  private getPeriods(c: Course): number[] {

    // The grid has 75 cells, 15 per day, Monday through Friday

    // Initialize the day, which will also work for Monday
    let day = 1;
    if (c.classTue == 'Y') day = 16;
    if (c.classWed == 'Y') day = 31;
    if (c.classThu == 'Y') day = 46;
    if (c.classFri == 'Y') day = 61;

    // Initialize the periods, time start
    let timesStart = ["8:00:00", "8:55:00", "9:50:00", "10:45:00", "11:40:00", "12:35:00", "13:30:00", "14:25:00", "15:20:00", "16:15:00", "17:10:00", "18:05:00"];
    // Get the period within the day
    let periodStart = timesStart.findIndex(t => t == c.classStart);

    // Initialize the periods, time end
    let timesEnd = ["8:50:00", "9:45:00", "10:40:00", "11:35:00", "12:30:00", "13:25:00", "14:20:00", "15:15:00", "16:10:00", "17:05:00", "18:00:00", "18:55:00"];
    // Get the period within the day
    let periodEnd = timesEnd.findIndex(t => t == c.classEnd);

    // Now that we have the start and end, determine ALL periods for the course
    let periods: number[] = [];
    for (let i = periodStart; i <= periodEnd; i++) {
      periods.push(day + i);
    }

    return periods;
  }

}