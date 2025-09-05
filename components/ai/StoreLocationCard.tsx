
import React from 'react';
import { Store } from '../../types';
import MapPinIcon from '../icons/MapPinIcon';

interface StoreLocationCardProps {
    store: Store;
}

const StoreLocationCard: React.FC<StoreLocationCardProps> = ({ store }) => {
    return (
        <div className="p-3 bg-black/20 rounded-lg flex items-start gap-3">
            <div className="mt-1">
                <MapPinIcon className="w-5 h-5 text-pink-300 flex-shrink-0"/>
            </div>
            <div>
                 <h4 className="font-semibold text-sm text-white">{store.name}</h4>
                 <p className="text-xs text-gray-400 mt-0.5">{store.address}</p>
                 <p className="text-xs text-gray-300 mt-2 italic">"{store.reason}"</p>
            </div>
        </div>
    );
};

export default StoreLocationCard;
