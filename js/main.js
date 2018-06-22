$(document).ready(function(){

    //Use MultiSelect library to make multi select form fields to work correctly.
    $('#impact').multiSelect();
    $('#effect').multiSelect();
    $('#chromasome').multiSelect();
    $('#table-select').multiSelect();

    // this is the id of the form
    $("#main-form").submit(function (e) {
        //alert('working');
        e.preventDefault(); // avoid to execute the actual submit of the form.

        

        var formData = []; // Variable for all form data to get sent.

        var geneResult = $('#geneID').val();

        var phenotypeResult = $('#phenotype').val();
        
        var impactResult = [];
        $('#ms-impact .ms-elem-selection.ms-selected').each(function () {
            impactResult.push($(this).attr('val'));
        });

        var effectResult = [];
        $('#ms-effect .ms-elem-selection.ms-selected').each(function () {
            effectResult.push($(this).attr('val'));
        });

        var startPos = $('#startPos').val();
        var endingPos = $('#endingPos').val();
        
        //Chromasome
        var chrResult = [];
        $('#ms-chromasome .ms-elem-selection.ms-selected').each(function () {
            chrResult.push($(this).attr('val'));
        });

        //Table Select
        var tableResult = [];
        $('#ms-table-select .ms-elem-selection.ms-selected').each(function () {
            tableResult.push($(this).attr('val'));
        });


        //Catch Honeypot data
        var name = $('#name').val();

        //Push all data into one array to send over ajax
        formData.push(geneResult);
        formData.push(phenotypeResult);
        formData.push(impactResult);
        formData.push(effectResult);
        formData.push(startPos);
        formData.push(endingPos);
        formData.push(chrResult);
        formData.push(tableResult);
        formData.push(name);

        console.log(formData);
        
        //console.log(formData);
        var url = "inc/query.php"; // the script where you handle the form input.
        $.ajax({
            type: "POST",
            url: url,   
            data: { formdata : formData }, 
            success: function (data) {
                console.log('Success!');
                console.log(data);
                buildData(data);
            },
            error: function(data){
                console.log('Error with Ajax data request. Return data:');
                console.log(data);
            }
        });
    });


    function buildData(data){
        var html = "";
        $('.results').empty();
        
        $(data).each(function(){
            
            html = ""; //Clear out html variable
            
            html += '<div class="row result">';
            //Sample ID
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Sample ID <br>';
                    html += this.sample_id;
                html += '</p>';
            html += '</div>';

            //Mutation
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Mutation <br>';
                    html += this.ref + ' -> ' + this.allele;
                html += '</p>';
            html += '</div>';

            //Gene
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Gene <br>';
                    html += this.gene;
                html += '</p>';
            html += '</div>';

            //Impact
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Impact <br>';
                    html += this.impact;
                html += '</p>';
            html += '</div>';

            //Amino Acid Change
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Amino Acid Change <br>';
                    html += this.amino_acid_change;
                html += '</p>';
            html += '</div>';

            //Sorghum Annotation
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Sorghum Annotation <br>';
                    html += this.sorghum_annotation;
                html += '</p>';
            html += '</div>';

            //Genomic Locus
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Genomic Locus <br>';
                    html += this.chrom + ':' + this.posn;
                html += '</p>';
            html += '</div>';

            //Quality
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Quality <br>';
                    html += this.qual;
                html += '</p>';
            html += '</div>';

            //Effect
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Effect <br>';
                    html += this.effect;
                html += '</p>';
            html += '</div>';

            //Codon Change
            html += '<div class="col-sm-6 sample-id">';
                html += '<p>';
                    html += 'Codon Change <br>';
                    html += this.codon_change;
                html += '</p>';
            html += '</div>';

            html += '</div>';




            $(html).appendTo('.results');
            //console.log(this);
        });
    };


    


            
    


});