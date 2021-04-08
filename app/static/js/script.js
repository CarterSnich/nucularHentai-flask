// regex pattern (?<!\d)\d{1,6}(?!\d)

// removes duplicated values in an array
function rmDuple(array) {
    if (array) {
        let uniqueArray = [];

        // Loop through array values
        for (let i = 0; i < array.length; i++) {
            if (uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    }
    return null;
}


$(document).ready(function () {
    console.log('DOM ready.');

    // bind tooltips to elements
    $(document).tooltip({
        selector : '[data-toggle="tooltip"]'
    })

    $('form').on('submit', function (e) {
        e.preventDefault(); // prevents the form to action by itself

        // breaks down all 1 and 6 digit nuke codes
        let broken_codes = rmDuple($(this).find('textarea').val().match(/(?<!\d)\d{1,6}(?!\d)/g));
        console.log(broken_codes);

        $('#aftermath-list h4').html(`Found ${broken_codes ? broken_codes.length : 0} nuke code(s)!`);
        $('#aftermath-list ul.list-group').html('');

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

                        let tags_div = function () {
                            let html = document.createElement('div');
                            html.className = "ml-2";
                            doujin['tags'].forEach((tag, i) => {
                                $(html).append(`<small class="badge badge-secondary mr-1">${tag}</small>`)
                            })
                            return html.outerHTML;
                        }()

                        let artist_div = function () {
                            let html = document.createElement('div');
                            html.className = "ml-2";
                            doujin['artist'].forEach((artist, i) => {
                                $(html).append(`
                                    <a class="mr-1 d-inline-flex badge p-0" href="${artist['url']}">
                                        <span class="p-1 rounded-left">${artist['name']}</span>
                                        <span class="p-1 rounded-right">${artist['count']}</span>
                                    </a>
                                `);
                            })
                            return html.outerHTML;
                        }()

                        let languages = function () {
                            let html = document.createElement('div');
                            html.className = "ml-2";
                            doujin['languages'].forEach((lang, i) => {
                                $(html).append(`<small class="badge badge-secondary mr-1">${lang}</small>`)
                            })
                            return html.outerHTML;
                        }()

                        let categories = function () {
                            let html = document.createElement('div');
                            html.className = "ml-2";
                            doujin['categories'].forEach((cat, i) => {
                                $(html).append(`<small class="badge badge-secondary mr-1">${cat}</small>`)
                            })
                            return html.outerHTML;
                        }()

                        $('#aftermath-list ul.list-group').append(`
                            <li id="${doujin['id']}" class="list-group-item list-group-item-${index % 2 == 0 ? 'light' : 'dark'} list-group-item-action rounded-sm mb-1">
                                <div class="d-flex w-100">
                                    <a href="/read_manga?code=${doujin['id']}">
                                        <img src="${doujin['poster_link']}" class="img-fluid img-thumbnail" width="100%"  data-toggle="tooltip" data-placement="top" title="Read with lite reader">
                                    </a>
                                    <div class="w-100 ml-3">
                                        <code class="badge badge-secondary font-weight-bold">#${doujin['id']}</code>
                                    </div>
                                </div>
                                <div class="w-100">
                                    <div class="w-100">
                                        <a class="btn btn-link text-left m-0 p-0 border-0" href="https://nhentai.net/g/${doujin['id']}" data-toggle="tooltip" data-placement="top" title="View on nHentai">
                                            ${doujin['title_pretty']}
                                            <span class="glyphicon glyphicon-new-window"></span>
                                        </a>
                                    </div>
                                    <small class="text-muted mb-1">${doujin['title_release']}</small>
                                    <div class="w-100 doujin-details">
                                        <div class="doujin-tags d-inline-flex w-100 mt-1">
                                            Tags: 
                                            ${tags_div}
                                        </div>
                                        <div class="doujin-artists d-inline-flex w-100 mt-1">
                                            Artists: 
                                            ${artist_div}
                                        </div>
                                        <div class="doujin-languages d-inline-flex w-100 mt-1">
                                            Languages: 
                                            ${languages}
                                        </div>
                                        <div class="doujin-categories d-inline-flex w-100 mt-1">
                                            Categories: 
                                            ${categories}
                                        </div>
                                        <div class="doujin-categories d-inline-flex w-100 mt-1">
                                            Pages:
                                            <small class="badge badge-secondary ml-2">${doujin['pages']}</small>
                                        </div>
                                        <div class="doujin-categories d-inline-flex w-100 mt-1">
                                            Uploaded: <span class="text-primary ml-2">${doujin['uploaded']}</span>
                                        </div>
                                    </div>
                                </div>

                            </li>
                        `)
                    })
                    .catch((err) => { console.log(`${code} : ${err}`) })
            })


            $('#aftermath-list ul.list-group').on('click', 'li div a', function (e) {
                e.preventDefault();
                window.open(this.getAttribute('href'));
            })
        }

    })


})