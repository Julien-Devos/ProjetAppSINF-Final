var dataSet = [
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim id gravida. Duis elementum aliquet nulla id pellentesque. Praesent nec pharetra mauris.","Il y a 5min"],
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 10min"],
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 20min"],
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 20min"],
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 20min"],
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 20min"],
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 20min"],
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 20min"],
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 20min"],

    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 20min"],
    ["Premier post","Admin","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis dui a rhoncus blandit. Ut ut cursus massa. Vestibulum hendrerit nec enim ...","Il y a 20min"]
];

$(document).ready(function () {
    var table = $('#dt-select').DataTable({
        data: dataSet,
        "order":[],
        "columnDefs": [
            { "orderable": false, "targets": [0,1,2,3] },
            { "width": "20%", "targets": [0,1,3] },
            { "width": "40%", "targets": 2 }
        ],
        columns: [{
            title: "Titre"
        },
            {
                title: "Auteur"
            },
            {
                title: "Contenu"
            },
            {
                title: ""
            }
        ],
        searching: false,
        dom: 'Bfrtip'
    });
});