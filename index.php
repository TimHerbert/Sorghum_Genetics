<?php 
include_once('inc/header.php'); 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

  <!-- Navigation -->

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="#"><img src="img/logo.png"></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
        
      </div>
    </div>
  </nav>



  <!-- Header section -->

  <header>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
            <h1>LCSC Sorghum Research Project</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce hendrerit, quam non tempus bibendum, ipsum velit porttitor dui, a vestibulum ipsum dolor sit amet diam. Duis fringilla lobortis dui, ac rhoncus lacus dapibus et. Curabitur malesuada ex sed ultricies euismod. Duis a odio sit amet ex ornare posuere. Praesent mollis, dolor at congue mollis, ipsum ante scelerisque mi, id porttitor lorem nisi sed justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas id turpis non mi aliquet ullamcorper. Aliquam in risus id felis placerat vestibulum a at leo. 
            </p>
        </div>
      </div>
    </div>
  </header>

<!-- Form Section -->
  <div class="container">
    <div class="row">
      <div class="col-sm-6">
        <form id="main-form">
          <input name="phenotype" type="text" class="form-control" id="phenotype" placeholder="Phenotype">
          <small id="phenotype-help" class="form-text text-muted">Can search Annotation fields including, maize and arabidopsis.</small>
          <p class="advanced-control">+ Advanced Search</p>

          <div class="advanced" style="display: none;">
            
            <input name="geneID" type="text" class="form-control" id="geneID" aria-describedby="Gene ID" placeholder="Gene ID">
            
            <label for="impact">Impact</label>
            <select name="impact" multiple class="form-control" id="impact">
              <option val="MODERATE">MODERATE</option>
              <option val="HIGH">HIGH</option>
            </select>

            <!-- <select name="effect" multiple class="form-control" id="effect">
              <option val="NON_SYNONYMOUS_CODING">NON SYNONYMOUS CODING</option>
              <option val="STOP_GAINED">STOP GAINED</option>
              <option val="SPLICE_SITE_ACCEPTOR">SPLICE SITE ACCEPTOR</option>
              <option val="SPLICE_SITE_DONOR">SPLICE SITE DONOR</option>
              <option val="START_LOST">START LOST</option>
            </select> -->

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
                  echo "Error with database connection.";
              }
              $conn->close();
              ?>    
            </select>
      

            <input style="display:none;" type="text" name="name" id="name" value="" />
            
            
            <label for="table-select">Table Select</label>
            <select multiple class="form-control" id="table-select">
              <option val="hom" selected="selected">Hom</option>
              <option val="het" selected="selected">Het</option>
              <option val="het_indels" selected="selected">Het Indels</option>
              <option val="hom_indels" selected="selected">Hom Indels</option>

            </select>
            <small id="table-help" class="form-text text-muted">You must have at least one table selected. By default all tables are slected. <br>Deselect tables to speed up results.</small>
          </div> <!-- End of Advanced search functionality container.-->
          
          
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
      
      
      
    </div>
  </div>

<div class="container">
  <div class="row">
    <div class="col-sm-6 preloader-container">
      <p>Query in Progress</p>
      <div class="preloader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</div>

  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <p class="back"> << Back to Search</p>
      </div>
    </div>
  </div>
<!-- Results Section -->  
  <div class="container">
    <div class="results">

      
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