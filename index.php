<?php 
include_once('inc/header.php'); 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>


<!-- Form Section -->
  <div class="container">
    <div class="row">
      <div class="col-sm-6">
        <form id="main-form">
          <label for="geneID">Gene ID</label>
          <input name="geneID" type="text" class="form-control" id="geneID" aria-describedby="Gene ID" placeholder="Gene ID">

          <label for="phenotype">Phenotype</label>
          <input name="phenotype" type="text" class="form-control" id="phenotype" placeholder="Phenotype">
          <small id="phenotype-help" class="form-text text-muted">Can search Annotation fields including, maize and arabidopsis.</small>
        
          <label for="impact">Impact</label>
          <select name="impact" multiple class="form-control" id="impact">
            <option val="MODERATE">MODERATE</option>
            <option val="HIGH">HIGH</option>
          </select>

          <label for="effect">Effect</label>
          <select name="effect" multiple class="form-control" id="effect">
            <option val="NON_SYNONYMOUS_CODING">NON SYNONYMOUS CODING</option>
            <option val="STOP_GAINED">STOP GAINED</option>
            <option val="SPLICE_SITE_ACCEPTOR">SPLICE SITE ACCEPTOR</option>
            <option val="SPLICE_SITE_DONOR">SPLICE SITE DONOR</option>
            <option val="START_LOST">START LOST</option>
          </select>

          <label for="startPos">Starting Position</label>
          <input name="startPos" type="text" class="form-control" id="startPos" aria-describedby="Starting Position" placeholder="Starting Position">

          <label for="endingPos">Ending Position</label>
          <input name="endingPos" type="text" class="form-control" id="endingPos" aria-describedby="Ending Position" placeholder="Ending Position">
          
          <label for="chromasome">Chromasome</label>
          <select name="chromasome" multiple class="form-control" id="chromasome">
            <?php
            //Setup database connection and get all the chromasomes.
            include_once('inc/connection.php');
            $sql = "select chrom from het UNION DISTINCT select chrom from hom order by chrom;";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo '<option val="' . $row["chrom"] . '">' . $row["chrom"] . '</option>';
                }
            } else {
                echo "Error with database.";
            }
            $conn->close();
            ?>    
          </select>
    

          <input style="display:none;" type="text" name="name" id="name" value="" />
          
          
          <label for="table-select">Table Select</label>
          <select multiple class="form-control" id="table-select">
            <option val="hom" selected="selected">Hom</option>
            <option val="het">Het</option>
          </select>
          <small id="table-help" class="form-text text-muted">You must have at least one table selected.</small>
          
          
          <br><br>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
      
      
      
    </div>
    <hr>
  </div>

<!-- Results Section -->  
  <div class="container">
    <div class="row results">
      
    </div><!-- end of row -->
  </div><!-- end of container -->

<?php
//Notes for building results.
//$sql = "SELECT * FROM hom limit 10";

//Mutation, Quality*, Impact*, Effect*, ImpactType, Annotation, GeneID, SampleID, Codon Change*, Amino Change*
//Actually Displaying the following:
// Sample ID, Chrom, Posn, Ref, Allelle, Qual, Gene, Effect, Impact, Codon Change, Amino Acid Change, Sorghum Annotation

//Merge Chrom and Posn Fields into one called "Genomic Locus" Seperate values by colon Example Chr01 : 144404
// Merge Rev and Allele Fields into one called Mutation by seperating values by -> Example G->A
/*
The Gene Column is the Gene ID.
Sample ID is Column 3 in the original file.
Let’s use the "Sorghum Annotation" as the Annotation field.
“Mutation” is as explained above. It is a combination of the “Ref" and “Allele”.
Chrom refers to the name of the chromosome and Posn refers to the nth position on the chromosome.
*/

?>

<?php include_once('inc/footer.php'); ?>