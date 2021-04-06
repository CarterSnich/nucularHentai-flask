// regex pattern (?<!\d)\d{1,6}(?!\d)


$(document).ready(function () {
    console.log('DOM ready.');

    $('form').on('submit', async function (e) {
        e.preventDefault(); // prevents the form to action by itself

        // breaks down all 5 and 6 digit nuke codes
        let broken_codes = $(this).find('textarea').val().match(/(?<!\d)\d{1,6}(?!\d)/g);
        console.log(broken_codes);

        $('#aftermath-list h4').html(`Found ${broken_codes.length} nuke code(s)!`);
        // $('#aftermath-list div.spinner-border').show();
        $('#aftermath-list div.list-group').html('');

        if (broken_codes) {
            broken_codes.forEach(async (code, index) => {
                let body = new FormData();
                body['code'] = code;

                // retrieve doujin data
                let response = await fetch('/nuke_codes', {
                    method: 'POST',
                    headers: new Headers({
                        //'Content-Type': 'application/x-www-form-urlencoded'
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify(body)
                })
                .catch((err) => {console.log(`${code} : ${err}`)})
                let doujin = await response.json();
                console.log(doujin);

                let tags_html;

                doujin['tags'].forEach((tag, i) => {
                    tags_html += `<small class="badge badge-secondary">${tag}</small>`
                })

                $('#aftermath-list div.list-group').append(`
                    <a id="${doujin['id']}" class="list-group-item list-group-item-${index % 2 == 0 ? 'secondary' : 'dark'}" href="https://nhentai.net/g/${doujin['id']}">
                        <div class="d-flex w-100 justify-content-between">
                            <img src="${doujin['poster_link']}" class="img-fluid img-thumbnail" width="80%">
                            <code class="text-muted">${doujin['id']}</code>
                        </div>
                        <p class="mb-1">${doujin['title_pretty']}</p>
                        <small class="text-muted">${doujin['title_release']}</small>
                        <br>${tags_html}
                    </a>
                `)
            })
        }
        // $('#aftermath-list div.spinner-border').hide();

    })

})