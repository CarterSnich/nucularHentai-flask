// regex pattern (?<!\d)\d{1,6}(?!\d)


$(document).ready(function () {
    console.log('DOM ready.');

    $('form').on('submit', function (e) {
        e.preventDefault(); // prevents the form to action by itself

        // breaks down all 1 and 6 digit nuke codes
        let broken_codes = $(this).find('textarea').val().match(/(?<!\d)\d{1,6}(?!\d)/g);
        console.log(broken_codes);

        $('#aftermath-list h4').html(`Found ${broken_codes ? broken_codes.length : 0} nuke code(s)!`);
        // $('#aftermath-list div.spinner-border').show();
        $('#aftermath-list div.list-group').html('');

        if (broken_codes) {
            broken_codes.forEach(async (code, index) => {
                let body = new FormData();
                body['code'] = code;

                // retrieve doujin data
                await fetch('/nuke_codes', {
                    method: 'POST',
                    headers: new Headers({
                        //'Content-Type': 'application/x-www-form-urlencoded'
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify(body)
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);

                        let doujin = data;
                        let tags_div = document.createElement('div');

                        doujin['tags'].forEach((tag, i) => {
                            $(tags_div).append(`<small class="badge badge-secondary">${tag}</small>`)
                        })

                        $('#aftermath-list div.list-group').append(`
                            <a id="${doujin['id']}" class="list-group-item list-group-item-${index % 2 == 0 ? 'light' : 'dark'}" href="https://nhentai.net/g/${doujin['id']}">
                                <div class="d-flex w-100 justify-content-between">
                                    <img src="${doujin['poster_blob']}" class="img-fluid img-thumbnail" width="80%">
                                    <code class="text-muted">${doujin['id']}</code>
                                </div>
                                <p class="mb-1">${doujin['title_pretty']}</p>
                                <small class="text-muted">${doujin['title_release']}</small>
                                <br>
                                ${$(tags_div).html()}
                            </a>
                        `)
                    })
                    .catch((err) => { console.log(`${code} : ${err}`) })
            })
        }

    })

})