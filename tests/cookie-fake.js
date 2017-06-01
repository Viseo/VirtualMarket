/**
 * Created by MZA3611 on 01/06/2017.
 */

exports.cookie = class {
    createCookie(name, value, expires,path,domain) {

    }

    getCookie(cname){
        let test = this.cookie.substring(this.cookie.indexOf(":",this.cookie.indexOf(cname))+1,this.cookie.indexOf(";",this.cookie.indexOf(cname)));
       return test;
    }

    deleteCookie(name){
    }

    setCookie(basket,page,payment,ray,address){
        this.cookie = "basket:" + basket +";page:" +page + ";payment:" + payment + ";ray:" + ray + ";address:" + address +";";
    }

};