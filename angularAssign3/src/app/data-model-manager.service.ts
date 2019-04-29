import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Credit } from "./dataModelClasses";
import { Student } from "./dataModelClasses";
import { Course } from "./dataModelClasses";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataModelManagerService {

  private url: string = 'https://secret-ocean-38431.herokuapp.com/api/';
  private currentStudent: Student;
  private cartSaved: Course[];
  
  constructor(private http: HttpClient) { }

  // Options object for POST and PUT requests
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Error handler, from the Angular docs
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  saveCart(student: Student, coursesSelected: Course[]): Observable<any> {
    var tempURL = this.url + "students/" + student._id + "/cart/save";
    return this.http.put<any>(tempURL, coursesSelected, this.httpOptions)
    .pipe(
      catchError(this.handleError('updateStudent', student))
    );
  }
  
  confirmCart(student: Student, coursesSelected: Course[]): Observable<any> {
    var tempURL = this.url + "students/" + student._id + "/cart/confirm";
    return this.http.put<any>(tempURL, coursesSelected, this.httpOptions)
    .pipe(
      catchError(this.handleError('updateStudent', student))
    );
  }

  clearCart(student: Student,coursesSelected: Course[]): Observable<any> {
    var tempURL = this.url + "students/" + student._id + "/cart/clear";
    return this.http.put<any>(tempURL, coursesSelected, this.httpOptions)
    .pipe(
      catchError(this.handleError('updateStudent', student))
    );
  }

  studentsGetAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.url + "students");
  }

  studentGetById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.url + "students"}/${id}`);
  }

  studentGetByUsername(username: string): Observable<Student> {
    return this.http.get<Student>(this.url + "students/username/" + username);
  }

  coursesGetAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.url + "courses");
  }

  courseGetWinter2019(academicProgram: string): Observable<Course[]> {
    return this.http.get<Course[]>(this.url + "courses/" + academicProgram.toLowerCase() + "/winter2019");
  }

  getCurrentStudent(): Student{
    return this.currentStudent;
  }

  setCurrentStudent(student: Student): void{
    this.currentStudent = student;
  }
}