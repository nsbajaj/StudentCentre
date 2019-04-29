import { Component, OnInit, Input } from '@angular/core';

class GridCell {
  cellNumber: number;
  courseCode: string;
  section: string;
  termSectionId: number;
  cellColour: string;
}

@Component({
  selector: 'app-cart-selected-cell',
  templateUrl: './cart-selected-cell.component.html',
  styleUrls: ['./cart-selected-cell.component.css']
})
export class CartSelectedCellComponent implements OnInit {

  // Passed-in collection of courses to be rendered
  @Input()
  cellData: GridCell[];

  @Input()
  data: string;

  constructor() { }

  ngOnInit() {
    //console.log("CellData Length: " + this.cellData.length);
    //console.log(this.data);
  }

}
