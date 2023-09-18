 var name = 'Max'
var age = 20;
var hasHobbies = true

function summarizeUser(userName, userAge, userHasHobby) {
    //this is a function declaration
}

const funcc = () => {
    //arrow function
}

const add = (a, b) => {
    return a + b //eg
}

const addOne = a => {
    //if only 1 arg
}

add(4, 6) //call

const person = {
    name: 'hii',
    age: 29,
    isCompleted: true,

    //object

    greet: () => { //can have function
        console.log(this.name) //accessing name of this object inside
    },

    hello() {
        //can write it this way also
    }

}

const hobbies = ['Sprots, "sbfjb', 1, 'can mix and match ', {}];
//array

for (let hobby in hobbies) {
    console.log(hobby)
}

console.log(hobbies.map(hobby => {
    //how we want to map something(represnt it) - a method in js
    return "hobby " + hobby

}))

hobbies.push("pohraa") //add new element to array


const newHarr = hobbies.slice(); //cuts array. can pass args to narrow dowwn selection

const copiedArra = [...hobbies, "sssd"] //spread operator use the array and you can add new ones also on top of that

const toArrya = (...args) => {
    //this is rest operator, similar as spread but more used when we want to pass a lot of arguments in a functop
    return args;
}

const shA = (person) => {
    console.log(person.name)
}

shA(person)

//to acheiev above functionality, we use destructuring
//just write what you actually need
const saa = ({ name, age }) => {
    console.log(name + age)
}

const { name, age } = person //destructuring,
//in object we pull them out by property name
//curly bracs

const [hobby1, hobby2] = hobbies
//in arrays we pull them out based on position, 0th index elem witll be in hobby1 1 - hobby2
//square bracs


//async fun and callbacks
setTimeout(() =>
    {console.log("timer is done"); },2000); //will run in 2 sec

const fetchdata = (callback) =>{
    setTimeout (()=>{
        callback('done')
    },1500)
}

const fsetchdata = callback => {
    const promise = new Promise((resolve,reject ) => {
        resolve('dpne')
    })
    return promise
}

setTimeout(()=>{
    fetchdata()
    .then(text => {
        return text
    })
    .then(whatnext=>{
        return whatnext
    })
    .then(maybemore=>{
        return maybemore
    })
})

console.log(`My name is ${person.name} and I am ${person.age} years old.`);



