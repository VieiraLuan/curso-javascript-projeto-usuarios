class UserController {



    constructor(formId, idTableUsers) {
        this.formElement = document.getElementById(formId);
        this.tableUsersElement = document.getElementById(idTableUsers);
        this.onSubmit();
        this.onEditCancel();
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


            let values = this.getValues();

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
                        console.error(e);
                    }
                );
            }





        });



        document.getElementById("btnUpdateAndSave").addEventListener('click', e => {
            console.log("to no update");
            e.preventDefault();
            let values = this.getValues("btnUpdateAndSave");
            console.log("Veja os Values" + values);


            if (!values == false) {

                /*Save alter aqui, trocar retorno do getvaleus dentro do get valeus */
                this.addLine(values);

                // this.updateformElement.reset
                // this.formElement.reset();


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



    getValues(parameter) {

        let user = {}; // Meu Json
        let objUser = new User();
        let isValid = true;
        let whatElement = this.formElement;

        if (parameter == "btnUpdateAndSave") {

            whatElement == document.getElementById("form-user-update");
        } else if (parameter == "") {

            whatElement = this.formElement;
        }
        // Array.from(this.formElement.elements).forEach(function (field, index)
        Array.from(whatElement.elements).forEach(function (field, index) {

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
                return false;
            }

            if (field.name == "gender") {
                // Pegue apenas o campo checado
                if (field.checked) {
                    // Alimentando o JSon
                    user[field.name] = field.value;
                }



            } else if (field.name == "admin") {
                // Determinando qual tipo de usuario
                if (objUser.isAdmin("exampleInputAdmin") == true) {
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
                console.log(field.value);
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
                      <td>
                        <button type="button" id="btn-editar" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                        <button type="button" id="btn-excluir" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                      </td>
                    `;

        tr.querySelector(".btn-edit").addEventListener("click", (e) => {

            let elements = tr.querySelectorAll('td');

            this.changePainel(true);

            Array.from(elements).forEach(e => {
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


            });
        });


        this.tableUsersElement.appendChild(tr);




    }






}