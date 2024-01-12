import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface DataObj {
  email: string,
  name: string,
  hexCode: string,
  maskedEmail?: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Unique Schools';

  numberOfJoinees: number = 0;

  noJoineesText: string = "No joinees as of now";

  @ViewChildren('inputEle')
  inputEle: QueryList<ElementRef>;

  userForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl(),
      hexCode: new FormControl({ value: '', disabled: true }),
      maskedEmail: new FormControl()
    }
  )

  localStorageArray: DataObj[] = []

  lastHexCodeEnc: string = '';
  isSame: boolean = false;

  joinButtonClickHandler() {
    const currentHexCodeValue = this.hexCodeGenerator();
    //TODO: check why enc value is taken for comparission when it is showing as normal value in input box
    //this is to generate a new hex code if there 
    if (this.lastHexCodeEnc !== currentHexCodeValue) {
      this.encryptHexCode(currentHexCodeValue);
      this.transformAndPushData();
      localStorage.setItem('tableData', JSON.stringify(this.localStorageArray))
      this.numberOfJoinees = this.localStorageArray.length;
    }
    this.resetForm()
    this.focusFirstInputElement()
  }

  encryptHexCode(currentHexCodeValue: string) {
    let encHexCode = window.btoa(currentHexCodeValue);
    this.lastHexCodeEnc = encHexCode;
    return encHexCode;
  }

  hexCodeGenerator() {
    let n = Math.floor(Math.random() * 0xFFFFFFFFFFFFFFFF).toString(16);
    return (n.slice(0, 16));
  }

  resetForm() {
    this.userForm.reset();
  }

  transformAndPushData() {
    let currentEmail: string = this.userForm.value.email;
    let specialCharPos = currentEmail.indexOf("@");

    // Mask all characters from the 3rd character to the special character
    let maskedPart = currentEmail.slice(2, specialCharPos).replace(/./g, '*');

    // Form the masked email
    let maskedEmail = currentEmail.slice(0, 2) + maskedPart + currentEmail.slice(specialCharPos);

    console.log(maskedEmail);

    // Update the form control's value
    this.userForm.get('maskedEmail')?.setValue(maskedEmail);
    this.userForm.value.hexCode = this.lastHexCodeEnc;
    this.localStorageArray.unshift(this.userForm.value)
  }

  focusFirstInputElement() {
    const firstInputElement = this.inputEle.first;
    if (firstInputElement) {
      firstInputElement.nativeElement.focus();
    }
  }

  rowClickHandler(row: DataObj) {
    let currentUserFormValue = this.userForm.value
    let currentEmailValue = currentUserFormValue.email;
    let currentNameValue = currentUserFormValue.name;
    let currentHexCodeValue = currentUserFormValue.hexCode;
    // if (!(currentEmailValue && currentNameValue && currentHexCodeValue)) {
    this.loadDetailsIntoInputFields(row)
    // }
  }

  loadDetailsIntoInputFields(row: DataObj) {
    let rowClone = JSON.parse(JSON.stringify(row));
    let decHexCode = this.decryptHexCode(rowClone)
    this.userForm.patchValue({ email: rowClone.email, name: rowClone.name, hexCode: decHexCode })
  }

  decryptHexCode(row: any) {
    return window.atob(row.hexCode)
  }

  dragStart(event: DragEvent, index: number): void {
    // event.dataTransfer?.setData('text/plain', index.toString());
  }

  dragEnter(event: DragEvent, index: number): void {
    // event.preventDefault();
    // Add styles or other feedback to indicate potential drop target
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }
 
  drop(event: DragEvent, targetIndex: number): void {
    const startIndex = parseInt(event.dataTransfer?.getData('text/plain') || '', 10);
    const [draggedItem] = this.localStorageArray.splice(startIndex, 1);
    this.localStorageArray.splice(targetIndex, 0, draggedItem);
  }

}
