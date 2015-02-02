#!/usr/bin/perl
#
# @File sw.pl
# @Author bechir
# @Created 1 févr. 2015 19:45:34
#

use strict;
use warnings;
use Scrappy;
use Image::Resize;
use Data::Dumper;

my $image_path = '/home/bechir/Downloads/SwAndPo/tmpimage/';
my $icon_path = '/home/bechir/Downloads/SwAndPo/tmpimage/icon/';

my ($Swords, $Daggers, $Axes, $Harmor, $Gauntlets, $Hhelmets, $Hboots, $Armor,
 $Boots, $Gloves, $Helmets, $Clothes, $Shoes, $Bracers, $Hats, $Shields, $Herbs,
 $Potions, $Scrolls, $Bows, $Guns, $Thrown, $Music, $Maces, $Spears,
 $Staves, $Amulets, $Rings, $none) = undef;
my  $scraper = Scrappy->new;
my  $scraper2 = Scrappy->new;
my  $scraper3 = Scrappy->new;
        
if ($scraper->get('http://www.edgebee.com/wiki/index.php?title=Edgebee_Wiki:SP2_master_item_list')->page_loaded) {
    for (my $i = 1; $i < 537; $i++){
        my $line = undef;
        my $elements = $scraper->select('#bodyContent table tr')->focus($i)->select('td')->data;
        ${$elements}[0]->{html} =~ /<a href="(.*)"\s*title=/;
        my $link = 'http://www.edgebee.com/'.$1;
        my $pic_src = undef;
        my $picture = clean_name(${$elements}[0]->{text}).'.png';
        my $ressources = undef;
        if(${$elements}[11]->{text}!~/\s?0\s?/){
            $ressources = $ressources.'"Iron":'.remove_space(${$elements}[11]->{text});
        }
        if(${$elements}[12]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Wood":'.remove_space(${$elements}[12]->{text});
        }
        if(${$elements}[13]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Herbs":'.remove_space(${$elements}[13]->{text});
        }
        if(${$elements}[14]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Leather":'.remove_space(${$elements}[14]->{text});
        }
        if(${$elements}[15]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Fabric":'.remove_space(${$elements}[15]->{text});
        }
        if(${$elements}[16]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Powder":'.remove_space(${$elements}[16]->{text});
        }
        if(${$elements}[17]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Dyes":'.remove_space(${$elements}[17]->{text});
        }
        if(${$elements}[18]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Elfwood":'.remove_space(${$elements}[18]->{text});
        }
        if(${$elements}[19]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Glass":'.remove_space(${$elements}[19]->{text});
        }
        if(${$elements}[20]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Oil":'.remove_space(${$elements}[20]->{text});
        }
        if(${$elements}[21]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Ironwood":'.remove_space(${$elements}[21]->{text});
        }
        if(${$elements}[22]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Steel":'.remove_space(${$elements}[22]->{text});
        }
        if(${$elements}[23]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Crystals":'.remove_space(${$elements}[23]->{text});
        }
        if(${$elements}[24]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Mithril":'.remove_space(${$elements}[24]->{text});
        }
        if(${$elements}[25]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Gems":'.remove_space(${$elements}[25]->{text});
        }
        if(${$elements}[26]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Acid":'.remove_space(${$elements}[26]->{text});
        }
        if(${$elements}[27]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Tear":'.remove_space(${$elements}[27]->{text});
        }
        if(${$elements}[28]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Volcanic":'.remove_space(${$elements}[28]->{text});
        }
        if(${$elements}[29]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Shell":'.remove_space(${$elements}[29]->{text});
        }
        if(${$elements}[30]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Feather":'.remove_space(${$elements}[30]->{text});
        }
        if(${$elements}[31]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Ice":'.remove_space(${$elements}[31]->{text});
        }
        if(${$elements}[32]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Horn":'.remove_space(${$elements}[32]->{text});
        }
        if(${$elements}[33]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Moon":'.remove_space(${$elements}[33]->{text});
        }
        if(${$elements}[34]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Roaring":'.remove_space(${$elements}[34]->{text});
        }
        if(${$elements}[35]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Silk":'.remove_space(${$elements}[35]->{text});
        }
        if(${$elements}[36]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Shadow":'.remove_space(${$elements}[36]->{text});
        }
        if(${$elements}[37]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Dragon":'.remove_space(${$elements}[37]->{text});
        }
        if(${$elements}[38]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Sun":'.remove_space(${$elements}[38]->{text});
        }
        if(${$elements}[39]->{text}!~/\s?0\s?/){
            if($ressources){$ressources = $ressources.',';}
            $ressources = $ressources.'"Divine":'.remove_space(${$elements}[39]->{text});
        }

        $line = ',{'.
            '"image":"'.$picture.'",'.
            '"Recipe":"'.remove_space(${$elements}[0]->{text}).'",'.
            '"Category":"'.remove_space(${$elements}[1]->{text}).'",'.
            '"Worker":"'.remove_space(${$elements}[2]->{text}).'",'.
            '"Price":'.remove_space(${$elements}[3]->{text}).','.
            '"Time":'.remove_space(${$elements}[4]->{text}, 1).','.
            '"CXP":'.remove_space(${$elements}[5]->{text}).','.
            '"SXP":'.remove_space(${$elements}[6]->{text}).','.
            '"MaxResource":"'.remove_space(${$elements}[7]->{text}).'",'.
            '"Rare":'.remove_space(${$elements}[8]->{text}, 1).','.
            '"Level":'.remove_space(${$elements}[9]->{text}).','.
            '"Workstation":"'.remove_space(${$elements}[10]->{text}).
            '","Ressources":['.$resources.']}';
            
        if(remove_space(${$elements}[1]->{text}) eq 'Amulets'){
            $Amulets = $line. $Amulets;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Armor'){
            $Armor = $line. $Armor;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Axes'){
            $Axes = $line. $Axes;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Boots'){
            $Boots = $line. $Boots;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Bows'){
            $Bows = $line. $Bows;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Bracers'){
            $Bracers = $line. $Bracers;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Clothes'){
            $Clothes = $line. $Clothes;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Daggers'){
            $Daggers = $line. $Daggers;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Gauntlets'){
            $Gauntlets = $line. $Gauntlets;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Gloves'){
            $Gloves = $line. $Gloves;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Guns'){
            $Guns = $line. $Guns;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Hats'){
            $Hats = $line. $Hats;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Heavy armor'){
            $Harmor = $line. $Harmor;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Heavy helmets'){
            $Hhelmets = $line. $Hhelmets;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Helmets'){
            $Helmets = $line. $Helmets;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Herbs'){
            $Herbs = $line. $Herbs;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Maces'){
            $Maces = $line. $Maces;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Music'){
            $Music = $line. $Music;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Potions'){
            $Potions = $line. $Potions;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Rings'){
            $Rings = $line. $Rings;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Scrolls'){
            $Scrolls = $line. $Scrolls;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Shields'){
            $Shields = $line. $Shields;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Shoes'){
            $Shoes = $line. $Shoes;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Spears'){
            $Spears = $line. $Spears;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Staves'){
            $Staves = $line. $Staves;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Swords'){
            $Swords = $line. $Swords;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Thrown'){
            $Thrown = $line. $Thrown;
        }elsif(remove_space(${$elements}[1]->{text}) eq 'Heavy boots'){
            $Hboots = $line. $Hboots;
        }else{
            $none = $line. $none;
        }
        if ($scraper2->get($link)->page_loaded) {
            my $src = $scraper2->select('#bodyContent table')->focus(0)->select('tr')->focus(1)->data;
            @{$src}[-2]->{html}=~ /src="(.*)"\s/i;
            $pic_src = $1;
            $scraper3->download($pic_src, $image_path, $picture);
            resize($image_path.$picture, 16, 16, $icon_path.$picture);
        }
        
#print "$line\n$link\n$picture\n";
    }
    print "$Swords\n\n$Daggers\n\n$Axes\n\n$Harmor\n\n$Gauntlets\n\n$Hhelmets\n\n$Hboots\n\n$Armor\n\n
 $Boots\n\n$Gloves\n\n$Helmets\n\n$Clothes\n\n$Shoes\n\n$Bracers\n\n$Hats\n\n$Shields\n\n$Herbs\n\n
 $Potions\n\n$Scrolls\n\n$Bows\n\n$Guns\n\n$Thrown\n\n$Music\n\n$Maces\n\n$Spears\n\n
 $Staves\n\n$Amulets\n\n$Rings\nERMAC\n$none";
}
sub clean_name{
    my $clean = shift @_;
    $clean =~ s/\s/-/g;
    $clean =~ s/\*//;
    $clean =~ s/'/-/;
    return $clean;
}
sub remove_space{
    my $unspaced = shift @_;
    $unspaced =~ s/^ //;
    $unspaced =~ s/ $//;
    if($_[0]){
        if($unspaced eq 'No'){
            return 0;
        }elsif($unspaced eq 'Very Fast' || $unspaced eq 'Yes'){
            return 1;
        }elsif($unspaced eq 'Fast'){
            return 2;
        }elsif($unspaced eq 'Medium'){
            return 3;
        }elsif($unspaced eq 'Long'){
            return 4;
        }elsif($unspaced eq 'Very Long'){
            return 5;
        }else{
            return "unspec";
        }
    }
    return $unspaced;
}
sub resize {
    my ($inputfile, $width, $height, $outputfile) = @_;
    GD::Image->trueColor(1);
    my $gdo = GD::Image->new($inputfile);

    {
        my $k_h = $height / $gdo->height;
        my $k_w = $width / $gdo->width;
        my $k   = ($k_h < $k_w ? $k_h : $k_w);
        $height = int($gdo->height * $k);
        $width  = int($gdo->width * $k);
    }

    my $image = GD::Image->new($width, $height);
    $image->alphaBlending(0);
    $image->saveAlpha(1);
    $image->copyResampled($gdo, 0, 0, 0, 0, $width, $height, $gdo->width, $gdo->height);

    open my $FH, '>', $outputfile;
    binmode $FH;
    print {$FH} $image->png;
    close $FH;
}
__END__
