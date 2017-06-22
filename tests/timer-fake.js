/**
 * Created by TNA3624 on 31/05/2017.
 */

exports.timer = class {

    pickDate(){}

    getYear(){
        return this.currentDate.getFullYear();
    }

    getMonth(){
        return this.currentDate.getMonth();
    }

    getDayInMonth(){
        return this.currentDate.getDate();
    }

    getDayInWeek(){
        return this.currentDate.getDay();
    }

    getNextMonth(){
        return (this.currentDate.getMonth()+1)%12;
    }

    getDate(time){
        return new Date(time);
    }

    getTime(){
        return this.currentDate.getTime();
    }

    getNumberOfDaysInMonth(month,year){
        return new Date(year,month+1,0).getDate();
    }

    setNow(date){
        this.currentDate=date;
        return this;
    }
    getFullDate(year,month,day){
        return new Date(year,month,day);
    }
};