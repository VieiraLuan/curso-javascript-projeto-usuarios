class UserController {



    constructor(formId, idTableUsers, formIdUpdate) {
        this.formElement = document.getElementById(formId);
        this.formElementUpdate = document.getElementById(formIdUpdate);
        this.tableUsersElement = document.getElementById(idTableUsers);
        this.onSubmit();
        this.onEditCancel();
        this.onEdit();
    }

    onEditCancel() {
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
            this.changePainel(false);
            e.preventDefault();
        });
    }

    changePainel(value) {
        if (value == true) {
            document.querySelector("#box-user-create").style.display = "none";
            document.querySelector("#box-user-update").style.display = "block";
        } else {
            document.querySelector("#box-user-create").style.display = "block";
            document.querySelector("#box-user-update").style.display = "none";
        }
    }

    onSubmit() {


        this.formElement.addEventListener("submit", (e) => {



            e.preventDefault();

            let btn = this.formElement.querySelector("[type=submit]");

            btn.disabled = true;


            let values = this.getValues(this.formElement, "add");

            if (!values == false) {

                this.getPhoto().then(
                    (content) => {
                        values.photo = content;
                        this.addLine(values);
                        btn.disabled = false;
                        /**/
                        this.formElement.reset();
                    },
                    (e) => {

                    }
                );
            }





        });

    }

    getPhoto() {

        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            let elements = [...this.formElement.elements].filter(item => {
                if (item.name === 'photo') {

                    return item;
                }
            });

            let file = (elements[0].files[0]);

            fileReader.onload = () => {

                resolve(fileReader.result);
            };

            fileReader.onerror = (e) => {

                reject(e);
            };
            if (file) {

                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }
        });

    }

    onEdit() {

        this.formElementUpdate.addEventListener('submit', e => {
            e.preventDefault();
            let btn = document.getElementById("btnUpdateAndSave");
            // btn.disabled = true;
            let values = this.getValues(this.formElementUpdate, "update");



            // Pega a linha do dataSet
            let index = this.formElement.dataset.trIndex;

            let tr = this.tableUsersElement.rows[index];

            tr.innerHTML = ` 
                      <td><img src=${values.photo} alt="User Image" class="img-circle img-sm"></td>
                      <td id="tdName" >${values.name}</td>
                      <td id="tdEmail" >${values.email}</td>
                      <td id="tdChkAdmin" >${values.admin}</td>
                      <td>${values.registerDate}  </td>
                      <td>
                        <button type="button" id="btn-editar" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                        <button type="button" id="btn-exclui" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                      </td>
                    `;


            this.formElementUpdate.reset();




        });
    }

    getValues(form, operation) {

        let user = {}; // Meu Json
        let objUser = new User();
        let isValid = true;
        let changeInput = "exampleInputAdmin";




        Array.from(form.elements).forEach(function (field, index) {

            if (operation != "update") {

                if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                    field.parentElement.classList.add('has-error');
                    isValid = false;
                    return false;
                }
            }



            if (field.name == "gender") {
                // Pegue apenas o campo checado
                if (field.checked) {
                    // Alimentando o JSon
                    user[field.name] = field.value;
                }

            } else if (field.name == "admin") {
                // Determinando qual tipo de usuario
                if (operation == "update") {
                    changeInput = "exampleInputAdminUp";
                }
                if (objUser.isAdmin(changeInput) == true) {
                    field.value = "Administrador";
                    user[field.name] = field.value;
                    // Alterando o numero de usuarios
                    objUser.updateFieldsUserAdm("numAdm");
                    objUser.updateFieldsUserAdm("numUser");
                    field.value = "True";

                } else {
                    field.value = "Padrão";
                    user[field.name] = field.value;
                    objUser.updateFieldsUserAdm("numUser");
                    field.value = "False";

                }

            } else if (field.name == "birth") {

                user[field.name] = field.value;
                let a = field.value = objUser.getRegister();
                user["registerDate"] = a;

            } else {
                // obj,[nome do campo] = o valor do campo
                // aqui temos a chave e na frente o valor dessa chave

                user[field.name] = field.value;
            }



        });


        if (!isValid) {
            return false;
        }

        objUser = new User(user.name, user.gender,
            user.birth, user.country, user.email,
            user.password, user.photo, user.admin, user.registerDate);

        return user;



    }

    addLine(dataUser) {

        let tr = document.createElement('tr');



        tr.innerHTML = ` 
                      <td><img src=${dataUser.photo} alt="User Image" class="img-circle img-sm"></td>
                      <td id="tdName" >${dataUser.name}</td>
                      <td id="tdEmail" >${dataUser.email}</td>
                      <td id="tdChkAdmin" >${dataUser.admin}</td>
                      <td>${dataUser.registerDate}  </td>
                      
                        <td><button type="button" id="btn-editar" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button></td>
                        <td id="btn-exclui"><button type="button"  class="btn btn-danger btn-xs btn-flat">Excluir</button></td>
                      
                    `;



        tr.querySelector(".btn-edit").addEventListener("click", (e) => {

            let elements = tr.querySelectorAll('td');

            /*Carrega a linha no data set*/
            this.formElement.dataset.trIndex = tr.sectionRowIndex;

            this.changePainel(true);

            Array.from(elements).forEach(e => {
                if (e.id == "btn-exclui") {

                    e.addEventListener("click", e => {

                        let index = this.formElement.dataset.trIndex;
                        let line = this.tableUsersElement.rows[index];
                        document.getElementById('table-users').deleteRow(line);
                        this.changePainel(true);
                        this.formElementUpdate.reset();
                    });

                }
                if (e.id == "tdName") {
                    document.getElementById("exampleInputNameUp").value = (dataUser.name);
                } else if (e.id == "tdEmail") {

                    document.getElementById("exampleInputEmailUp").value = (dataUser.email);

                } else if (e.id == "tdChkAdmin") {
                    if (e.innerHTML == "Padrão") {
                        document.getElementById("exampleInputAdminUp").checked = false;
                    }

                    if (e.innerHTML == "Administrador") {
                        document.getElementById("exampleInputAdminUp").checked = true;
                    }

                } else if (dataUser.gender != "") {

                    if (dataUser.gender == "M") {
                        document.getElementById("exampleInputGenderMUp").checked = true;

                    } else {

                        document.getElementById("exampleInputGenderFUp").checked = true;

                    }
                }

                document.getElementById("exampleInputBirthUp").value = (dataUser.birth);
                document.getElementById("exampleInputCountryUp").value = (dataUser.country);
                document.getElementById("exampleInputPasswordUp").value = (dataUser.password);
                // document.getElementById("exampleInputFileUp").src = tr.querySelector(".img-circle").src;



            });

            let objUser = new User();

            if (document.getElementById("exampleInputAdminUp").checked == true) {

                objUser.updateFieldsUserAdmUp("numAdm");
                objUser.updateFieldsUserAdmUp("numUser");

            } else {

                objUser.updateFieldsUserAdmUp("numUser");
            }

        });










        this.tableUsersElement.appendChild(tr);




    }






}