/**
 * Created by TNA3624 on 02/06/2017.
 */

exports.windowFunc=class {
    setResize(){
        window.onresize = ()=>{
            this.reload();
        }
    }

    reload(){
        window.location.reload();
    }
};