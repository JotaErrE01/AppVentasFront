class DobleCaraCanvas {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
    }

    join(images) {
        this.ctx.beginPath();


        const screen_width = window.screen.width;

        const size = screen_width < 420 ? screen_width : 420;
        this.canvas.width = size;

        this.canvas.height = 0
        images.forEach(element => {
            this.canvas.height += this.canvas.width * (element.height / element.width);
        });

        let positionY = 0;
        images.forEach(element => {
            
            const increment = this.canvas.width * (element.height / element.width);;
            this.ctx.drawImage(element, 0, positionY, this.canvas.width, increment);
            positionY += increment;
        });


        /// resize mdf
        const _width = this.canvas.width;
        const _height = this.canvas.height


        if (_height > 841) {
            this.resize(_width,_height,images);
        }


    }



    resize(_width,_height,images) {
        

        const new_height = 841;
        const resize_ratio =new_height/_height;
        const new_width= (this.canvas.width* resize_ratio);


        this.canvas.width = new_width;
        this.canvas.height = new_height;



        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let positionY = 0;

        images.forEach(element => {
            const increment = (new_width * (element.height / element.width));
            this.ctx.drawImage(element, 
                0, 
                positionY, 
                new_width,
                increment
            );
            positionY += increment;
        });

      
 
    }
    save() {

        const payload = this.canvas.toDataURL("image/jpeg");
        

        return payload
    }
}

export { DobleCaraCanvas }