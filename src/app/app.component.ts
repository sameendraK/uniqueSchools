import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

interface DataObj {
  email: string,
  name: string,
  hexCode: string,
  maskedEmail?: string,
  hashedEmail?: string,
  hashedName?: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'Unique Schools';

  numberOfJoinees: number = 0;

  noJoineesText: string = "No joinees as of now";

  @ViewChildren('inputEle')
  inputEle: QueryList<ElementRef>;

  formBuilder: FormBuilder = new FormBuilder()

  userForm: FormGroup;

  localStorageArray: DataObj[] = []

  lastHexCodeEnc: string = '';

  isSame: boolean = false;

  loadedEmail: string = '';

  loadedName: string = '';

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email, this.emailValidator.bind(this)]),
      name: ['', [Validators.required]],
      hexCode: [{ value: '', disabled: true },],
      maskedEmail: [''],
      hashedEmail: [''],
      hashedName: ['']
    })
  }

  ngAfterViewInit() {
    this.focusFirstInputElement();
  }

  joinButtonClickHandler() {
    let changed = this.checkForChanges();
    if (changed) {
      this.transformAndPushData();
      this.resetForm();

      this.focusFirstInputElement();
      this.numberOfJoinees = this.localStorageArray.length;
    }
    else {
      this.displayNoChange();
    }
  }

  //hashed values of email, name are checked with hashed values of the details that are loaded into the user form.
  checkForChanges() {
    let email = this.userForm?.get('email')?.value;
    let name = this.userForm?.get('name')?.value;
    if (this.loadedEmail && this.loadedName) {
      let hashedEmail = this.applyHash(email);
      let hashedName = this.applyHash(name);
      if ((this.loadedEmail === hashedEmail) && (this.loadedName === hashedName)) {
        return false;
      }
      return true;
    }
    return true;
  }

  //
  transformAndPushData() {

    //hashing if it is a new entry (new entry doesn't have hex code value and it can't be entered because it is disabled. So, we generate hexcode and hash it).

    //HEX-CODE: if new entry
    let userDetailsObj = this.userForm.value;

    //hex-code generation
    let hexCode = this.hexCodeGenerator();

    //transforming data
    let hashedHexCode = this.applyHash(hexCode);
    let maskedEmail = this.applyEmailMask(userDetailsObj.email);
    let maskedHexCodeHash = this.applyHashedHexCodeMask(hashedHexCode);
    //
    let email = userDetailsObj.email;
    let name = userDetailsObj.name;

    //FORM CONTROL UPDATE
    this.updateFormControlValues(maskedEmail, maskedHexCodeHash, email, name);
    //RESULTS ARRAY UPDATE
    this.updateResults();
  }

  //used to reset the form
  resetForm() {
    this.userForm.reset();
    this.focusFirstInputElement();
  }

  //used to focus on the first input element (used viewChildren).
  focusFirstInputElement() {
    const firstInputElement = this.inputEle.first;
    if (firstInputElement) {
      firstInputElement.nativeElement.focus();
    }
  }

  emailValidator(control: any): any {
    if (control && control.value) {
      const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValidEmail: boolean = emailRegex.test(control.value);
      return isValidEmail ? null : { invalidEmail: true };
    }
    return null;
  }

  //method is called when there is no change in either user name or email.
  displayNoChange() {
    window.alert("No change detected. Change value to update the table");
  }

  updateFormControlValues(maskedEmail: string, hashedHexCode: any, email: string | null, name: string | null) {

    let hashedEmail = this.applyHash(email)
    let hashedName = this.applyHash(name)

    this.userForm.get('maskedEmail')?.setValue(maskedEmail);
    this.userForm.get('hashedEmail')?.setValue(hashedEmail);
    this.userForm.get('hashedName')?.setValue(hashedName);

    // this.userForm.value.hexCode = this.userForm.get('hexCode')?.setValue(hashedHexCode);
    this.userForm.value.hexCode = hashedHexCode;
  }

  updateResults() {
    this.localStorageArray.unshift(this.userForm.value)
    this.numberOfJoinees = this.localStorageArray.length;
  }

  storeDetailsInLocalStorage(rowClone: DataObj) {
    localStorage.setItem('name', rowClone.name);
    localStorage.setItem('email', rowClone.email)
  }

  loadDetailsIntoInputFields(row: DataObj) {
    let rowClone = JSON.parse(JSON.stringify(row));
    this.storeDetailsInLocalStorage(rowClone)
    this.userForm.patchValue({ email: rowClone.email, name: rowClone.name, hexCode: rowClone.hexCode });
    this.loadedEmail = this.applyHash(rowClone.email);
    this.loadedName = this.applyHash(rowClone.name);
  }

  isInValidForm() {
    return this.userForm.status === "INVALID";
  }

  //used to apply masking to the email.
  applyEmailMask(email: string): string {
    let currentEmail: string = this.userForm.value.email;
    let specialCharPos = currentEmail.indexOf("@");

    // Mask all characters from the 3rd character to the special character
    let maskedPart = currentEmail.slice(2, specialCharPos).replace(/./g, '*');

    // Form the masked email
    let maskedEmail = currentEmail.slice(0, 2) + maskedPart + currentEmail.slice(specialCharPos);

    return maskedEmail
  }

  applyHashedHexCodeMask(hash: string, visibleCharacters: number = 4): string {
    const maskedPart = '*'.repeat(hash.length - visibleCharacters);
    return (hash.substring(0, visibleCharacters) + maskedPart).substring(0, 16);

  }

  //we generate a hex code using the below method.
  hexCodeGenerator() {
    let n = Math.floor(Math.random() * 0xFFFFFFFFFFFFFFFF).toString(16);
    return (n.slice(0, 16));
  }

  //common method used to apply hash. This is done to maintain consistency
  applyHash(currentHexCodeValue: any) {
    const hashedValue = CryptoJS.SHA256(currentHexCodeValue).toString(CryptoJS.enc.Hex);
    return hashedValue;
  }

  rowClickHandler(row: DataObj) {
    this.loadDetailsIntoInputFields(row)
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
