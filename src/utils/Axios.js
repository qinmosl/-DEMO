import axios from 'axios'



function querysent(){  //查询句子

    axios.post('/api/brserver/test.php',
        `jwt=${localStorage.getItem('jwt')}`
    ).then(
        response => {
            if (response.data.code === 1) {
                return  true;
            } else {
                return  false;
            }
        },
        error => {
            return  false;
        }
    )    

}      

function updatesent(){  //更新句子

    axios.post('/api/brserver/test.php',
        `jwt=${localStorage.getItem('jwt')}`
    ).then(
        response => {
            if (response.data.code === 1) {
                return  true;
            } else {
                return  false;
            }
        },
        error => {
            return  false;
        }
    )    

}    

function querycountdown(){  //查询倒计时天数

    axios.post('/api/brserver/test.php',
        `jwt=${localStorage.getItem('jwt')}`
    ).then(
        response => {
            if (response.data.code === 1) {
                return  true;
            } else {
                return  false;
            }
        },
        error => {
            return  false;
        }
    )    

}   

function setcountdown(){  //设置倒计时天数

    axios.post('/api/brserver/test.php',
        `jwt=${localStorage.getItem('jwt')}`
    ).then(
        response => {
            if (response.data.code === 1) {
                return  true;
            } else {
                return  false;
            }
        },
        error => {
            return  false;
        }
    )    

} 



export { verifyjwt ,querysent ,updatesent  ,setcountdown,querycountdown}