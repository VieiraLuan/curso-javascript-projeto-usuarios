class User {

    // Propriedades e construtores
    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._register = this.formatDate();
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;


    }

    formatDate() {
        let data = new Date();
        let dataFormatada = ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear();
        return dataFormatada;
    }

    getRegister() {
        return this._register;
    }

    get email() {

        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get password() {

        return this._password;
    }

    set password(value) {
        this._password = value;
    }
    get photo() {

        return this._photo;
    }

    set photo(value) {
        this._photo = value;
    }

    get admin() {

        return this._admin;
    }

    set admin(value) {
        this._admin = value;
    }

    get name() {

        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get gender() {

        return this._gender;
    }

    set gender(value) {
        this._gender = value;
    }

    get birth() {

        return this._birth;
    }

    set birth(value) {
        this._birth = value;
    }

    get country() {

        return this._country;
    }

    set country(value) {
        this._country = value;
    }



    //Metodos

    isAdmin(value) {

        let situation = document.getElementById(value);

        if (situation.checked) {
            return true;
        } else {
            return false;
        }
    }

    updateFieldsUserAdm(value) {

        let numOfUsers = document.getElementById(value).innerHTML;
        let atual = parseInt(numOfUsers) + 1;
        document.getElementById(value).innerHTML = atual;
    }


}