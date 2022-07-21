const htmlTemplate = {

    messageWrapper: (msg) => {
        return `
            <style>
                .grid{
                    display: grid;
                    place-items:  center;
                    color: red;
                    font-size: 25px;
                    height : 200px;
                }
                .text{
                    padding-left: 5px;
                    padding-right: 5px;
                    text-align: center;
                }
            </style>
            <div class='grid'>
                <p class='text'>&#x26D4; ${msg} &#x26D4;</p>
            </div>`;
    }
}

export default htmlTemplate
