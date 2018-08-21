$(document).ready(function(){

    /*
        Various click controls
    */
    //control for showing advanced search functionality.
    $('.advanced-control').click(function(){
        //$('.advanced-control').slideUp();
        
        if($(this).hasClass('clicked')){
            $(this).removeClass('clicked');
            $('.advanced').slideUp();
            $(this).html('+ Advanced Search');
        } else {
            $('.advanced').slideDown();
            $(this).addClass('clicked');
            $(this).html('- Advanced Search');
        }
    });

    //controls the back to form button
    $('.back').click(function(){
        $('#main-form').show();
        $('.results, .back').hide();
    });

    //Controls the accordion feature.
    $(document).on('click', '.het-header', function(){
        if($(this).hasClass('clicked')){
            $(this).removeClass('clicked');
            //$('.het-body').slideUp(300);
            $(this).siblings('.het-body').slideUp(300);
        } else {
            $(this).addClass('clicked');
            //$('.het-body').slideDown(300);
            $(this).siblings('.het-body').slideDown(300);

        }
    });

    $(document).on('click', '.filter-button-container button', function(){
        $('.filter-button-container button').removeClass('active');
        if($(this).hasClass('stop-gain-btn')){
            if($(this).hasClass('active')){
                $('.stop-gain-filter').show();
            } else {
                $('.het-body .result').hide();
                $('.stop-gain-filter').show();
            }
        }
        if($(this).hasClass('splice-site-btn')){
            if($(this).hasClass('active')){
                $('.splice-site-filter').show();
            } else {
                $('.het-body .result').hide();
                $('.splice-site-filter').show();
            }
        }
        if($(this).hasClass('other-btn')){
            if($(this).hasClass('active')){
                $('.other-filter').show();
            } else {
                $('.het-body .result').hide();
                $('.other-filter').show();
            }
        }

    });

    //Use MultiSelect library to make multi select form fields to work correctly.
    $('#impact').multiSelect();
    $('#effect').multiSelect();
    $('#chromasome').multiSelect();
    $('#table-select').multiSelect();

    // this is the id of the form
    $("#main-form").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.

        $('.preloader-container').show();
        $('#main-form').hide();


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

        // console.log('Form Data');
        // console.log(formData);
        
        //console.log(formData);
        var url = "inc/query.php"; // the script where you handle the form input.
        $.ajax({
            type: "POST",
            url: url,   
            data: { formdata : formData }, 
            success: function (data) {
                // console.log('Success!');
                // console.log(data);
                preBuildData(data);
            },
            error: function(data){
                // console.log('Error with Ajax data request. Return data:');
                // console.log(data);
            }
        });
    });


    


    function preBuildData(data){
        $('.preloader-container').hide();
        $('.results').empty();
        $('.results').show();
        $('#main-form').hide();
        $('.back').show();

        

        

        var html = "";

        html += '<div class="filter-button-container">';
            html += '<div class="btn-group btn-group-toggle" data-toggle="buttons">';
                html += '<button class="btn btn-secondary stop-gain-btn">Stop Gain</button>';
                html += '<button class="btn btn-secondary splice-site-btn">Splice Site</button>';
                html += '<button class="btn btn-secondary other-btn">Other</button>';
            html += '</div>';
        html += '</div>';

        //Accordion opening
        html += '<div class="sorghum-accordion" id="sorghumResults">';

        


        $.each(data, function(key,value){
        

            //If There are het results build het.

            html += '<div class="het-container">';
                html += '<div class="het-header">';
                    if(key == 'het'){
                        html += 'Hetero Results';
                    }
                    if(key == 'hom'){
                        html += 'Homogenous Results';
                    }
                    if(key == 'het_indels'){
                        html += 'Hetero Indels Results';
                    }
                    if(key == 'hom_indels'){
                        html += 'Homogenous Indels Results';
                    }


                    html += '<span class="' + key + '-other">0</span>';
                    html += '<span class="' + key + '-splice-site">0</span>';
                    html += '<span class="' + key + '-stop-gain">0</span>';
                html += '</div>'; // end of het-header

                html += '<div class="het-body">'
                $(value).each(function(){
                    html += '<div class="container">'
                        html += '<div class="row result';
                        //add classes for filtering.
                        if(this.effect == 'STOP_GAINED'){
                            html += ' stop-gain-filter ';
                            //stopGainedCounter++;
                        }
                        if(this.effect == 'SPLICE_SITE_DONOR'){
                            html += ' splice-site-filter ';
                            //spliceSiteCounter++;
                        }
                        if(this.effect == 'START_LOST' || this.effect == 'STOP_LOST'){
                            html += ' other-filter '
                            //otherCounter++;
                        }

                        html += '">';
                            
                            //Sample ID
                            html += '<div class="col-sm-2">';
                                html += '<p>';
                                    html += '<strong>Sample ID </strong><br>';
                                    html += this.sample_id;
                                html += '</p>';
                            html += '</div>';
                            //Mutation
                            html += '<div class="col-sm-2">';
                                html += '<p>';
                                    html += '<strong>Mutation </strong><br>';
                                    html += this.ref + ' -> ' + this.allele;
                                html += '</p>';
                            html += '</div>';
                            //Gene
                            html += '<div class="col-sm-2">';
                                html += '<p>';
                                    html += '<strong>Gene </strong><br>';
                                    html += this.gene;
                                html += '</p>';
                            html += '</div>';
                            //Impact
                            html += '<div class="col-sm-2">';
                                html += '<p>';
                                    html += '<strong>Impact </strong><br>';
                                    html += this.impact;
                                html += '</p>';
                            html += '</div>';

                            //Amino Acid Change
                            html += '<div class="col-sm-2">';
                                html += '<p>';
                                    html += '<strong>Amino Acid Change </strong><br>';
                                    html += this.amino_acid_change;
                                html += '</p>';
                            html += '</div>';

                            //Genomic Locus
                            html += '<div class="col-sm-2">';
                                html += '<p>';
                                    html += '<strong>Genomic Locus </strong><br>';
                                    html += this.chrom + ':' + this.posn;
                                html += '</p>';
                            html += '</div>';

                            //Quality
                            html += '<div class="col-sm-2">';
                                html += '<p>';
                                    html += '<strong>Quality </strong><br>';
                                    html += this.qual;
                                html += '</p>';
                            html += '</div>';

                            //Effect
                            html += '<div class="col-sm-2">';
                                html += '<p>';
                                    html += '<strong>Effect </strong><br>';
                                    html += this.effect;
                                html += '</p>';
                            html += '</div>';

                            //Codon Change
                            html += '<div class="col-sm-2">';
                                html += '<p>';
                                    html += '<strong>Codon Change </strong><br>';
                                    html += this.codon_change;
                                html += '</p>';
                            html += '</div>';

                            //Sorghum Annotation
                            html += '<div class="col-sm-12">';
                                html += '<p>';
                                    html += '<strong>Sorghum Annotation </strong><br>';
                                    html += this.sorghum_annotation;
                                html += '</p>';
                            html += '</div>';

                            //Arabidopsis Annotation
                            html += '<div class="col-sm-12">';
                                html += '<p>';
                                    html += '<strong>Aribidopsis Annotation </strong><br>';
                                    html += this.arabidopsis_annotation;
                                html += '</p>';
                            html += '</div>';

                            //Maize Annotation
                            html += '<div class="col-sm-12">';
                                html += '<p>';
                                    html += '<strong>Maize Annotation </strong><br>';
                                    html += this.maize_annotation;
                                html += '</p>';
                            html += '</div>';

                        html += '</div>'; // end of row
                    html += '</div>'; // end of container

                }); // end of $(value).each()

                html += '</div>'; // end of het-body
            html += '</div>'; // end of het-container

            
            
        }); // end of $.each(data)
            


        //Add HTML to page
        $(html).appendTo('.results');

        
        $.each(data, function(key,value){
            console.log(key);

            //Counters for flag / filter controls.
            var stopGainedCounter    = 0;
            var spliceSiteCounter    = 0;
            var otherCounter         = 0;

            $(value).each(function(){
                console.log('inside value');
                console.log(this);

                if(this.effect == 'STOP_GAINED'){
                    //html += ' stop-gain-filter ';
                    stopGainedCounter++;
                }
                if(this.effect == 'SPLICE_SITE_DONOR'){
                    //html += ' splice-site-filter ';
                    spliceSiteCounter++;
                }
                if(this.effect == 'START_LOST' || this.effect == 'STOP_LOST'){
                    //html += ' other-filter '
                    otherCounter++;
                }

            }); // end of $(value).each()

            //Update Filter numbers
            $('span.' + key + '-other').html(otherCounter);
            $('span.' + key + '-splice-site').html(spliceSiteCounter);
            $('span.' + key + '-stop-gain').html(stopGainedCounter);
            //console.log(stopGainedCounter + ' stop gain');
        }); // end of $.each(data)
        


        $//('span.het-other').html('245');
    } // end of preBuildData()




    function buildData(data){
        var html = "";
        
        
        


        
        // if(data.het.length > 0){
        //     console.log('data.het length working');
        // }

        // html += '<div class="accordion" id="accordionExample">';
        //     html += '<div class="card">';
        //         html += '<div class="card-header" id="headingOne">';
        //             html += '<h5 class="mb-0">';
        //                 html += '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Collapsible Group Item #1</button>';
        //             html += '</h5>';
        //         html += '</div>';
        //     html += '</div>';
        //     html += '<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">';
        //         html += '<div class="card-body">';
        //             html += 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS.';
        //         html += '</div>';
        //     html += '</div>';


        //     html += '<div class="card">';
        //         html += '<div class="card-header" id="headingTwo">';
        //             html += '<h5 class="mb-0">';
        //                 html += '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">Collapsible Group Item #2</button>';
        //             html += '</h5>';
        //         html += '</div>';
        //     html += '</div>';
        //     html += '<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">';
        //         html += '<div class="card-body">';
        //             html += 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS.';
        //         html += '</div>';
        //     html += '</div>';
        // html += '</div>';

            














        $(data).each(function(){
            
            //html = ""; //Clear out html variable
            
            // html += '<div class="row result">';
            // //Sample ID
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Sample ID <br>';
            //         html += this.sample_id;
            //     html += '</p>';
            // html += '</div>';

            // //Mutation
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Mutation <br>';
            //         html += this.ref + ' -> ' + this.allele;
            //     html += '</p>';
            // html += '</div>';

            // //Gene
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Gene <br>';
            //         html += this.gene;
            //     html += '</p>';
            // html += '</div>';

            // //Impact
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Impact <br>';
            //         html += this.impact;
            //     html += '</p>';
            // html += '</div>';

            // //Amino Acid Change
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Amino Acid Change <br>';
            //         html += this.amino_acid_change;
            //     html += '</p>';
            // html += '</div>';

            // //Sorghum Annotation
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Sorghum Annotation <br>';
            //         html += this.sorghum_annotation;
            //     html += '</p>';
            // html += '</div>';

            // //Genomic Locus
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Genomic Locus <br>';
            //         html += this.chrom + ':' + this.posn;
            //     html += '</p>';
            // html += '</div>';

            // //Quality
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Quality <br>';
            //         html += this.qual;
            //     html += '</p>';
            // html += '</div>';

            // //Effect
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Effect <br>';
            //         html += this.effect;
            //     html += '</p>';
            // html += '</div>';

            // //Codon Change
            // html += '<div class="col-sm-6 sample-id">';
            //     html += '<p>';
            //         html += 'Codon Change <br>';
            //         html += this.codon_change;
            //     html += '</p>';
            // html += '</div>';

            // html += '</div>';




            //$(html).appendTo('.results');
            //console.log(this);
        });
    };


    


            
    


});