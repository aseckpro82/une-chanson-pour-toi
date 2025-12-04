import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ShareButtons({ testimonial }) {
  const shareUrl = window.location.href;
  const shareText = `"${testimonial.message}" - ${testimonial.customer_name} | Une Chanson Pour Toi`;

  const handleShare = (platform) => {
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Découvrez ce témoignage')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: 'Témoignage - Une Chanson Pour Toi',
            text: shareText,
            url: shareUrl
          }).catch(err => console.log('Erreur partage:', err));
          return;
        }
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-rose-200 hover:bg-rose-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigator.share && (
          <DropdownMenuItem onClick={() => handleShare('native')}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('email')}>
          <Mail className="w-4 h-4 mr-2" />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}