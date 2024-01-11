import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface DataObj {
  email: string,
  phone: string,
  hexCode: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Unique Schools';

  numberOfJoinees: number = 0;

  data = { id: 1, name: "Sameendra", code: "+91" }
  userForm: FormGroup = new FormGroup(
    {
      email: new FormControl(),
      phone: new FormControl(),
      hexCode: new FormControl()
    }
  )

  localStorageArray: DataObj[] = []

  saveData() {
    this.localStorageArray.push(this.userForm.value)
    localStorage.setItem('tableData', JSON.stringify(this.localStorageArray))
  }
}
