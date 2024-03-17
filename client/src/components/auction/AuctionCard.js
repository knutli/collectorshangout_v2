import React, { useState, useEffect } from 'react';
import { Card, CardFooter, Image } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auctionsPage.css';

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  const [auctionStatus, setAuctionStatus] = useState({ timeLeft: '', finished: false });


  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const end = new Date(auction.endTime); 
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setAuctionStatus({ timeLeft: `${days}d ${hours}h ${minutes}m ${seconds}s`, finished: false });
      } else {
        setAuctionStatus({ timeLeft: "Avsluttet", finished: true });
        clearInterval(interval);
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial update

    return () => clearInterval(interval);
  }, [auction.endTime]);

  const handleClick = () => {
    navigate(`/auction/${auction.id}`);
  };

  return (
    <div className='cards'>
    <Card hoverable isPressable onPress={handleClick} css={{ w: "100%", p: 0 }} isFooterBlurred className="border-none">
      <Image
        alt={auction.title || 'Auction Image'}
        src={auction?.imageUrls?.[0] || 'default_image_url'}
        objectfit="cover"
        height={200}
        width="100%"
      />
      <CardFooter className="justify-between items-left">
        <div className='cards-footer-text-container'>
          <p style={{ fontWeight: 'bold' }}>{auction.title || 'Mangler tittel'}</p>
          {auction.currentHighestBid ? (
            <p style={{ fontSize: 'small' }}>Høyeste bud: {auction.currentHighestBid} kr</p>
          ) : (
            <p style={{ fontSize: 'small' }}>Ingen bud ennå</p>
          )}
          <p style={{ fontSize: 'small', color: auctionStatus.finished ? 'red' : 'black' }}>
            {auctionStatus.timeLeft}
          </p>
        </div>
      </CardFooter>

    </Card>
    </div>
  );
};

export default AuctionCard;
