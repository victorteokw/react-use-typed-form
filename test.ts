import useTypedForm from "./src";

type FormTwo = {
    school: string
}

type FormOne = {
    name: string
    age: number
    graduated: boolean
    notes: string[]
    two: FormTwo
}

let form = useTypedForm<FormOne>({});
form.set("name", "abc");
form.set("age", 20);
form.set("graduated", true);
form.set("notes", ["a", "b"]);
form.set("two.school", "ab");
form.set("notes.2", "2");
let b = form.get("two.school");
let c = form.get("notes.0");
form.push("notes", "");