export interface Credit {
  _id: number;
  courseCode: string;
  courseName: string;
  termCompleted: string;
  gradeEarned: string;
}
  
export interface Student {
  _id: number;
  academicProgram: string;
  studentId: string;
  familyName: string;
  givenName: string;
  birthDate: string;
  email: string;
  academicLevel: number;
  gpa: number;
  credits: Array<Credit>;
  coursesSaved?: Array<Course>;
  coursesConfirmed?: Array<Course>;
};

export interface Course {
  _id: number;
  courseId: number;
  term: string;
  academicProgram: string;
  level: number;
  prerequisite: Array<string>;
  courseCode: string;
  section: string;
  termSectionId: number;
  enrolCapacity: number;
  enrolTotal: number;
  room: string;
  roomCapacity: number;
  classStart: string;
  classEnd: string;
  classMon: string;
  classTue: string;
  classWed: string;
  classThu: string;
  classFri: string;
  dateStart: string;
  dateEnd: string;
  professor: string;
}

export interface User {
  _id: number;
  "userName": string;
	"fullName": string;
	"password": string;
	"statusActivated": boolean;
	"statusLocked": boolean;
	"role": string;
	"claims": Array<String>;
}

// Activate
export class ActivateCredentials {
  "userName": string;
  "password": string;
  "passwordConfirm": string;
  "role": string;
}

// Create
export class CreateCredentials {
  "userName": string; 
  "fullName": string; 
  "password": string; 
  "passwordConfirm": string; 
  "role": string;
}

// Login
export class LoginCredentials {
  "userName": string;
  "password": string;
}