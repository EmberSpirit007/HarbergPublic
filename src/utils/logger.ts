export function info(text: string, data: any = null ){
    if(data){
        console.log(`%c ${text}`, 'color: #17a2b8', data);
        
    } else{
        console.log(`%c ${text}`, 'color: #17a2b8');
    }
}

export function contract(text: string, data: any = null ){
    if(data){
        console.log(`%c ${text}`, 'color: #8732a8', data);
        
    } else{
        console.log(`%c ${text}`, 'color: #8732a8');
    }
}


export default {
    info,
    contract
}