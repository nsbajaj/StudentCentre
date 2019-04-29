import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router"
import { Student, Course } from "./dataModelClasses";
import { DataModelManagerService } from './data-model-manager.service';
import { StudentDetailComponent } from './student-detail.component';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent implements OnInit {

  student: Student = null;
  coursesPossible: Course[] = []; //List of courses in Winter 2019
  coursesMatched: Course[] = []; //List of courses student is eligible to take
  coursesSelected: Course[] = []; //Courses selected by student
  message: string = null;

  constructor(private m: DataModelManagerService, private router: Router) { }

  ngOnInit() {
    this.student = this.m.getCurrentStudent();
    if(this.student == null){
      this.router.navigate(['/students']);
    }
    this.m.courseGetWinter2019(this.student.academicProgram).subscribe(p => {
      this.coursesPossible = p;
      this.courseMatch();
      this.coursesSelected = this.student.coursesSaved.concat();
    });
  }

  isCourseSelected(course: Course): boolean{
    var check = false;
    if(this.coursesSelected.length == 0){
      check = false;
    }
    else{
      for(var i = 0; i < this.coursesSelected.length; i++){
        if(course._id == this.coursesSelected[i]._id){
          check = true;
        }
      }
      if(!check){
        return false;
      }
    }
    return check;
  }

  // accepts a course object argument, and returns nothing
  // its purpose is to handle each course add/remove button task in the UI
  // as a result, it will copy the course object to the “courses selected” collection, or remove it.
  courseSelect(course: Course): void{
    var check = false;
    if(this.coursesSelected.length == 0){
      this.coursesSelected.push(course);
    }
    else{
      for(var i = 0; i < this.coursesSelected.length; i++){
        if(course._id === this.coursesSelected[i]._id){
          this.coursesSelected.splice(i, 1);
          check = true;
          break;
        }
      }
      if(!check){
        this.coursesSelected.push(course);
      }
    }
  }

  // accepts no argument, and returns nothing
  // its purpose is to save the “courses selected” collection as the value of a “cartSaved” property in the in-memory student document
  // it also sends a request to the web API to save the collection to the value of the “cartSaved” property in the database student document
  taskSaveCart(): void{
    //Saving in memory
    this.student.coursesSaved = this.coursesSelected;
    this.m.setCurrentStudent(this.student);
    
    //Saving in Web Service
    this.m.saveCart(this.student, this.coursesSelected).subscribe(p => this.message = p);
  }

  taskClear(): void{
    this.coursesSelected = [];
    this.student.coursesSaved = [];
    this.m.setCurrentStudent(this.student);
    
    this.m.clearCart(this.student, this.coursesSelected).subscribe(p => this.message = p);
  }
  
  // accepts no argument, and returns nothing
  // its purpose is to save the “courses selected” collection as the value of a “timetableSaved” property in the in-memory student document
  // it also sends a request to the web API to do a similar task; in addition, it updates the enrol total for each course selected
  // finally, it clears the value of the “cartSaved” property in both the in-memory and database student documents
  taskConfirmTimetable(): void{
    this.student.coursesConfirmed = this.coursesSelected;
  
    //Saving in Web Service
    this.m.confirmCart(this.student, this.coursesSelected).subscribe(p => this.message = p);
    
    //Clearing saved cart
    this.coursesSelected = []; //Clear local cart
    this.student.coursesSaved = []; 
    this.m.setCurrentStudent(this.student);  
  }

  courseMatch(): void {
    for(var i = 0; i < this.coursesPossible.length; i++){
      if(this.coursesPossible[i].prerequisite.length > 0){
        var match = 0;
        for(var j = 0; j < this.coursesPossible[i].prerequisite.length; j++){ //Check if it meets all the courses prerequisite
          for(var k = 0; k < this.student.credits.length; k++){
            if(this.coursesPossible[i].prerequisite[j] == this.student.credits[k].courseCode){
              match++;
              break;
            }
          }
        }
        //If match equals to the number of prerequisite, the student qualifies for the course. Add it to available courses.
        if(this.coursesPossible[i].prerequisite.length == match){
          this.coursesMatched.push(this.coursesPossible[i]);
        }
      }
    }
  }
}