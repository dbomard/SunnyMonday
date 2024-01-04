class Year{
  #year;
  #weeks;
  
  constructor(){
    let date = new Date();
    this.year = date.getFullYear();
  }

  get year(){
    return this.#year;
  }

  set year(newYear){
    this.#year = newYear
  }
}
