$(document).ready(function (){
    $('#idSelectFile').on('change', function (e){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            var inputData = reader.result;
            var replaceValue = (inputData.split(',')[0]);
            var base64string = inputData.replace(replaceValue + ",","");

            console.log(base64string);
            $('#Attachment').val(base64string);
        }
    });

});

function downloadPDF(data, filename){
    const linkSource = `data:application/pdf;base64,${data}`;
    const downloadLink = document.createElement('a');
    const fileName = filename + ".pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

function downloadFile(){
    downloadPDF($('#Attachment').val(),"Test");
}