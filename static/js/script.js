// regex pattern (?<!\d)\d{6}(?!\d)
$(document).ready(function () {

    $('form').on('submit', function (e) {

        e.preventDefault();

        let broken_codes = $(this).find('textarea').val().match(/(?<!\d)\d{6}(?!\d)/g);

        broken_codes.forEach((code, index) => {
            $('#aftermath-list ul').append(`
                <li class="list-group-item list-group-item-${index % 2 == 0 ? 'secondary' : 'dark'}">
                    <code>${code}</code>
                    <a href="http://nhentai.net/g/${code}">http://nhentai.net/g/${code}</a>
                </li>
            `)
        })

        // let body = new FormData();
        // body['codes'] = broken_codes

        // fetch('/nuke_codes', {
        //     method: 'POST',
        //     headers: new Headers({
        //         //'Content-Type': 'application/x-www-form-urlencoded'
        //         'Content-Type': 'application/json'
        //     }),
        //     body: JSON.stringify(body)
        // })
        // .then((res) => res.json())
        // .then((data) => {
        //     console.log(data);
        // })
    })

})