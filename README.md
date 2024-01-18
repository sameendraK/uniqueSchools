# UniqueSchools
**This project is deployed on:** https://sameendrak.github.io/uniqueSchools/
1. **Registeration Form:** This project is a registeration form for Unique Schools. Once the candidate registers, the details of the candidate will be reflected in the table displayed.
2. **Validations:** Validations are added such that if:
    1. Invalid email
    2. Both email and name fields are required to be filled.
3. **Join Functionality:** On clicking Join, the details are added and the count of the table is reflected based on that.
4. **Drag and drop:** The table rows are drag and drop enabled.
5. **Auto populate row:** On single click of the row, the details (name and email) are populated in the input fields.
6. **No change:** If there is no change in the value of the input when we click on join button, a popup will appear stating there is no change in the input fields.****
7. **Hashing powered editing:** The change is compared with the hashed value and if the hash values are different, then only new data will be added.
8. **Reset:** A reset button is implemented such that the input fields can be directly cleared and made empty instead of manually removing every character.
9. **Export CSV:** Export CSV functionality is added and it can be used to download and view the table data in CSV format. (only email and name fields are displayed).
10. **Auto Scroll:** If there are more than a limited number of entries, the table does not extend to the full page. Instead, a scroll appears and helps not to distort the UI.
11. **HEX code generation and hashing:** 16 digit hex code is not changeable, infact it is hashed and the hashed value is masked and we display that masked value instead of directly the hex code/ hash value.
12. **Manual HEX code:** HEX code is generated manually instead of using an external library.
13. **Mobile Friendly UI:** Mobile friendly UI is developed and the view is not distorted. (using media queries.)
14. **Local storage:** Data is encrypted and stored in the local storage.
15. **Focus First Element**: Once Join button is clicked or reset button is clicked, the focus automatically comes on to the first input element (email in this case) (using viewChildren).

**Librarires used:**
1. crypto-js: For hashing
2. ngx-csv: For CSV file download.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
