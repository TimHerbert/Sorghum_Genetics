SELECT sample_id, chrom, posn, ref, allele, qual, gene, effect, impact, codon_change, amino_acid_change, sorghum_annotation, maize_annotation, arabidopsis_annotation

FROM hom

WHERE gene LIKE "%Sobic.001G016700.1%" 
AND (impact = "HIGH" or impact = "MODERATE")
AND (effect = "NON_SYNONYMOUS_CODING" or effect = "START_LOST")
AND posn >= "1441407"
AND posn <= "1441407"
AND (chrom = "Chr01" or chrom = "Chr02")
AND (arabidopsis_annotation LIKE "%ion channel DMI1-like%" or maize_annotation LIKE "%ion channel DMI1-like%" or sorghum_annotation LIKE "%ion channel DMI1-like%")

limit 10;





-- Select * from Students 
-- where roll_no like '__2011%' 
-- and (subject1 ='maths' or subject2='maths' or subject3='maths' or subject4='maths' or subject5='maths' or subject6='maths');
