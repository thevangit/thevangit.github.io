function MyDate(year) {
    this.data = [];
    this.year = year;
    this.months = 12;

    this.initData = () => {
        for (let i=0; i< this.months; i++) {
            temp = [];
            temp.push((new Date(this.year, i, 1)).getDay());
            temp.push((new Date(this.year, i + 1 , 0)).getDate());
            this.data.push(temp);
        }
    };
}