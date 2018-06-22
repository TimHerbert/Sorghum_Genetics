<?php 
//Set header for appropriate return type.
header('Content-Type: application/json');
//Include the connection file. Excluded from git repository.
//Use MySQLi to create your own database connection.
include_once('connection.php'); 

$form_data = $_REQUEST['formdata'];

/*
Contents of $form_data as it comes from ajax. 
$form_data[0] = formData.push(geneResult);
$form_data[1] = formData.push(phenotypeResult);
$form_data[2] = formData.push(impactResult);
$form_data[3] = formData.push(effectResult);
$form_data[4] = formData.push(startPos);
$form_data[5] = formData.push(endingPos);
$form_data[6] = formData.push(chrResult);
$form_data[7] = formData.push(tableResult);
$form_data[8] = formData.push(name);
*/

//Check honey pot. If a robot filled out the form kill the script.
if($form_data[8] != "") {
    echo "no robots allowed!";
    die;
}

//Make sure data is clean for query string and build query string.
if( isset($form_data[0]) ){
    if( $form_data[0] != "" ){
        $gene_id = filter_var($form_data[0], FILTER_SANITIZE_STRING);
    }
}
if(isset($form_data[1])){
    if($form_data[1] != ""){
        $pheno = filter_var($form_data[1], FILTER_SANITIZE_STRING);
    }
}

if(isset($form_data[2])){
    if( $form_data[2] != "" ){
        $impact_results = array();
        foreach($form_data[2] as $impact_result){
            $impact = filter_var($impact_result, FILTER_SANITIZE_STRING);
            array_push($impact_results, $impact);
        }
    }
}
if(isset($form_data[3])){
    if( $form_data[3] != "" ){
        $effect_results = array();
        foreach($form_data[3] as $effect_result){
            $effect = filter_var($effect_result, FILTER_SANITIZE_STRING);
            array_push($effect_results, $effect);
        }
    }
}

if(isset($form_data[4])){
    if( $form_data[4] != "" ){
        $start_pos = filter_var($form_data[4], FILTER_SANITIZE_STRING);
    }
}
if(isset($form_data[5])){
    if( $form_data[5] != "" ){
        $ending_pos = filter_var($form_data[5], FILTER_SANITIZE_STRING);
    }
}

if(isset($form_data[6])){
    if( $form_data[6] != "" ){
        $chromosome_results = array();
        foreach($form_data[6] as $chromosome_result){
            $chromosome = filter_var($chromosome_result, FILTER_SANITIZE_STRING);
            array_push($chromosome_results, $chromosome);
        }
    }
}

if(isset($form_Data[7])){
    if( count($form_data[7]) != "" ){
        $table_results = array();
        foreach($form_data[7] as $table_result){
            $tables = filter_var($table_result, FILTER_SANITIZE_STRING);
            array_push($table_results, $tables);
        }
    }
}



//Start $sql_statement variable and init other clauses variables.
$sql_statement = '';
$sql_select = 'SELECT sample_id, chrom, posn, ref, allele, qual, gene, effect, impact, codon_change, amino_acid_change, sorghum_annotation ';
$sql_from = '';
$sql_where = '';


//Gene ID
if( isset($gene_id) ){
    $sql_where .= 'WHERE gene LIKE "%' . $gene_id . '%" ';
}

//Impact
if( isset($impact_results) ){
    if($sql_where == ''){
        $count = 0;
        foreach($impact_results as $impact){
            if($count == 0){
                $sql_where .= 'WHERE (impact = "' . $impact . '" ';
            } else {
                $sql_where .= 'OR impact = "' . $impact . '" ';
                
            }
            if( $count == (count($impact_results)-1) ){
                $sql_where .= ') ';
            }
            $count++;
        }
    } else {
        $count = 0;
        foreach($impact_results as $impact){
            if($count == 0){
                $sql_where .= 'AND ( impact = "' . $impact . '" ';
            } else {
                $sql_where .= 'OR impact = "' . $impact . '" ';
            }
            if( $count == (count($impact_results)-1) ){
                    $sql_where .= ') ';
                }
            $count++;
        }
    }
}

//Effect
if( isset($effect_results) ){
    if( $sql_where == '' ){
        $count = 0;
        foreach($effect_results as $effect){
            if($count == 0){
                $sql_where .= 'WHERE ( effect = "' . $effect . '" ';
            } else {
                $sql_where .= 'OR effect = "' . $effect . '" ';
                
            }
            if( $count == (count($effect_results)-1) ){
                $sql_where .= ') ';
            }
            $count++;
        }
    } else {
        $count = 0;
        foreach($effect_results as $effect){
            if($count == 0){
                $sql_where .= 'AND ( effect = "' . $effect . '" ';
            } else {
                $sql_where .= 'OR effect = "' . $effect . '" ';
            }
            if( $count == (count($effect_results)-1) ){
                $sql_where .= ') ';
            }
            $count++;
        }
    }
}


// Chromosome
if( isset($chromosome_results) ){
    if($sql_where == ""){
        $count = 0;
        foreach($chromosome_results as $chromosome){
            if($count == 0){
                $sql_where .= 'WHERE ( chrom = "' . $chromosome . '" ';
            } else {
                $sql_where .= 'OR chrom = "' . $chromosome . '" ';
            }
            if( $count == (count($chromosome_results)-1) ){
                $sql_where .= ') ';
            }
            $count++;
        }
    } else {
        $count = 0;
        foreach($chromosome_results as $chromosome){
            if($count == 0){
                $sql_where .= 'AND ( chrom = "' . $chromosome . '" ';
            } else {
                $sql_where .= 'OR chrom = "' . $chromosome . '" ';   
            }
            if( $count == (count($chromosome_results)-1) ){
                $sql_where .= ') ';
            }
            $count++;
        }
    }
}

//Starting Position
if( isset($start_pos) ){
    if($sql_where == ""){
        $sql_where .= 'WHERE posn >= "' . $start_pos . '" ';
    } else {
        $sql_where .= 'AND posn >= "' . $start_pos . '" ';
    }
}

// Ending Position
if( isset($ending_pos) ){
    if($sql_where == ""){
        $sql_where .= 'WHERE posn <= "' . $ending_pos . '" ';
    } else {
        $sql_where .= 'AND posn <= "' . $ending_pos . '" ';
    }
}

//Phenotype String Search
if( isset($pheno) ){
    if($sql_where == ''){
        $sql_where .= 'WHERE ( sorghum_annotation LIKE "%' . $pheno . '%" OR maize_annotation LIKE "%' . $pheno . '%" OR arabidopsis_annotation LIKE "%' . $pheno . '%" ) ';
    } else {
        $sql_where .= 'AND ( sorghum_annotation LIKE "%' . $pheno . '%" OR maize_annotation LIKE "%' . $pheno . '%" OR arabidopsis_annotation LIKE "%' . $pheno . '%" ) ';
    }
}



// If multiple tables or not.
if( isset($table_results) ){
    if( count($table_results) > 1 ){
        $union = 1;
    }
    $sql_from = 'FROM ' . $table_results[0] . ' ';
    

    if(isset($union)){

    }
}

//Assemble query
$sql_statement .= $sql_select;
$sql_statement .= $sql_from;
$sql_statement .= $sql_where;

$sql_statement .= "limit 1000;";
// echo $sql_statement;
// die;



$result = $conn->query($sql_statement);

$result_array = array();

if ($result->num_rows > 0) {
    // get the output data of each row
    while($row = $result->fetch_assoc()) {
        //Push everytrhing into a results array so that we can encode to json to use on the display page. 
        array_push($result_array, $row);
    }
    //Return the results in JSON format. 
    print_r(json_encode($result_array));
} else {
    //echo "No results found.";
    $result_array[0] = "No Results Found.";
    print_r(json_encode($result_array));
}
$conn->close();


?>

