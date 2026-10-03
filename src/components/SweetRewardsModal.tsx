import React, { useState } from 'react';
import { X, Award, Gift, Check, Plus } from 'lucide-react';
import { OrderRecord, Product, PRODUCTS } from '../data/bakeryData';

export interface RewardTier {
  name: string;
  minPoints: number;
  maxPoints: number | null;
  multiplierLabel: string;
  perks: string;
}

export const REWARD_TIERS: RewardTier[] = [
  {
    name: 'Bronze Crumb',
    minPoints: 0,
    maxPoints: 149,
    multiplierLabel: '1 pt per ₱10 spent',
    perks: 'Birthday cupcake voucher · Early access to monthly dispatches',
  },
  {
    name: 'Silver Whisk',
    minPoints: 150,
    maxPoints: 349,
    multiplierLabel: '1.25x points on cakes',
    perks: 'Complimentary dedication plaque · Priority morning oven slot',
  },
  {
    name: 'Gold Leaf Patissier',
    minPoints: 350,
    maxPoints: null,
    multiplierLabel: '1.5x points on all orders',
    perks: 'Free chilled delivery in Metro Manila · Complimentary 24k gold leaf upgrade',
  },
];

export interface RedeemableTreat {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  product: Product;
}

export const REDEEMABLE_TREATS: RedeemableTreat[] = [
  {
    id: 'reward-cassava',
    title: 'Complimentary Cassava Cake Merienda Pack',
    pointsCost: 80,
    description: 'Redeem 80 pts for a 3-slice golden macapuno cassava platter (₱85 value).',
    product: PRODUCTS[3],
  },
  {
    id: 'reward-muffins',
    title: 'Complimentary Wild Blueberry Muffin Duo',
    pointsCost: 95,
    description: 'Redeem 95 pts for a pair of warm brown-butter streusel muffins (₱95 value).',
    product: PRODUCTS[4],
  },
  {
    id: 'reward-ube-cupcakes',
    title: 'Complimentary Bohol Ube Cupcake Box (4 pcs)',
    pointsCost: 120,
    description: 'Redeem 120 pts for our signature purple yam & macapuno quartet (₱120 value).',
    product: PRODUCTS[1],
  },
  {
    id: 'reward-brownies',
    title: 'Complimentary Fudgy Sea Salt Brownie Box',
    pointsCost: 175,
    description: 'Redeem 175 pts for a 6-square box of 70% dark couverture brownies (₱180 value).',
    product: PRODUCTS[2],
  },
];

export function calculateLoyaltySummary(
  orders: OrderRecord[],
  redeemedPoints: number
) {
  const welcomeBonus = 50;
  const orderPoints = orders.reduce(
    (sum, ord) => sum + Math.floor(ord.total / 10),
    0
  );
  const lifetimePoints = welcomeBonus + orderPoints;
  const availablePoints = Math.max(0, lifetimePoints - redeemedPoints);

  let currentTier = REWARD_TIERS[0];
  let nextTier: RewardTier | null = REWARD_TIERS[1];

  if (lifetimePoints >= 350) {
    currentTier = REWARD_TIERS[2];
    nextTier = null;
  } else if (lifetimePoints >= 150) {
    currentTier = REWARD_TIERS[1];
    nextTier = REWARD_TIERS[2];
  }

  const pointsToNextTier = nextTier
    ? Math.max(0, nextTier.minPoints - lifetimePoints)
    : 0;

  const progressPercent = nextTier
    ? Math.min(
        100,
        Math.round(
          ((lifetimePoints - currentTier.minPoints) /
            (nextTier.minPoints - currentTier.minPoints)) *
            100
        )
      )
    : 100;

  return {
    welcomeBonus,
    orderPoints,
    lifetimePoints,
    availablePoints,
    currentTier,
    nextTier,
    pointsToNextTier,
    progressPercent,
  };
}

interface SweetRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  redeemedPoints: number;
  onRedeemTreat: (treat: RedeemableTreat) => void;
}

export const SweetRewardsModal: React.FC<SweetRewardsModalProps> = ({
  isOpen,
  onClose,
  orders,
  redeemedPoints,
  onRedeemTreat,
}) => {
  const [justRedeemedId, setJustRedeemedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const summary = calculateLoyaltySummary(orders, redeemedPoints);

  const handleRedeemClick = (treat: RedeemableTreat) => {
    if (summary.availablePoints < treat.pointsCost) return;
    onRedeemTreat(treat);
    setJustRedeemedId(treat.id);
    window.setTimeout(() => setJustRedeemedId(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Sweet Rewards Loyalty Program"
    >
      <div className="bg-[#FBF9F6] text-[#231712] border border-[#E6DFD5] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#1B120E] text-[#FBF9F6] px-6 py-5 border-b border-white/10 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#C69C53]">
              <Award className="w-4 h-4" />
              <span>SweetBites Patisserie Loyalty</span>
              <span aria-hidden="true">·</span>
              <span>Earn 1 Sweet Point per ₱10 spent</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold mt-0.5">
              Sweet Rewards & Member Tiers
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sweet Rewards modal"
            className="p-2 rounded-lg text-[#D9C8B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Points Balance & Tier Progress Card */}
          <div className="p-6 rounded-2xl bg-[#231712] text-[#FBF9F6] border border-[#38271F] space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#C69C53]">Available Balance</p>
                <p className="font-mono-tabular text-3xl sm:text-4xl font-semibold mt-1">
                  {summary.availablePoints} pts
                </p>
                <p className="text-xs text-[#B8A596] mt-1 font-mono-tabular">
                  Lifetime earned: {summary.lifetimePoints} pts
                </p>
              </div>

              <div>
                <p className="text-xs text-[#C69C53]">Current Member Tier</p>
                <p className="font-serif-display text-2xl sm:text-3xl font-semibold mt-1 text-[#F2C6CF]">
                  {summary.currentTier.name}
                </p>
                <p className="text-xs text-[#B8A596] mt-1">
                  {summary.currentTier.multiplierLabel}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#C69C53]">Orders Tracked</p>
                <p className="font-mono-tabular text-2xl sm:text-3xl font-semibold mt-1">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </p>
                <p className="text-xs text-[#B8A596] mt-1 font-mono-tabular">
                  +{summary.orderPoints} pts from orders · +{summary.welcomeBonus} welcome
                </p>
              </div>
            </div>

            {/* Progress Bar to Next Tier */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-[#D9C8B8]">
                <span>
                  {summary.nextTier
                    ? `${summary.pointsToNextTier} pts away from ${summary.nextTier.name}`
                    : 'Highest Tier Unlocked — Gold Leaf Patissier'}
                </span>
                <span className="font-mono-tabular">{summary.progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#C69C53] transition-all duration-300"
                  style={{ width: `${summary.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Reward Tiers Overview */}
          <div className="space-y-4">
            <div>
              <h3 className="font-serif-display text-2xl font-semibold text-[#231712]">
                Patisserie Membership Tiers
              </h3>
              <p className="text-xs text-[#6E5D53]">
                Your tier is determined by lifetime points earned across all SweetBites orders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REWARD_TIERS.map((tier) => {
                const isCurrent = tier.name === summary.currentTier.name;
                return (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-xl border space-y-2 ${
                      isCurrent
                        ? 'bg-[#F4EFEA] border-[#B84A62]'
                        : 'bg-white border-[#E6DFD5]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-serif-display text-xl font-semibold text-[#231712]">
                        {tier.name}
                      </h4>
                      <span className="font-mono-tabular text-xs text-[#8C6D58]">
                        {tier.maxPoints
                          ? `${tier.minPoints}–${tier.maxPoints} pts`
                          : `${tier.minPoints}+ pts`}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#B84A62]">
                      {tier.multiplierLabel} · {isCurrent ? 'Active Tier' : 'Tier Benefit'}
                    </p>
                    <p className="text-xs text-[#5E4E45] leading-relaxed">
                      {tier.perks}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redeem Points for Fresh Treats */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h3 className="font-serif-display text-2xl font-semibold text-[#231712]">
                  Redeem Your Sweet Points
                </h3>
                <p className="text-xs text-[#6E5D53]">
                  Claimed treats are added directly to your shopping cart at ₱0.
                </p>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-[#231712]">
                Available: {summary.availablePoints} pts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REDEEMABLE_TREATS.map((treat) => {
                const canAfford = summary.availablePoints >= treat.pointsCost;
                const isJustRedeemed = justRedeemedId === treat.id;
                return (
                  <div
                    key={treat.id}
                    className="p-4 rounded-xl bg-white border border-[#E6DFD5] flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#8C6D58]">
                        <span className="flex items-center gap-1 font-medium">
                          <Gift className="w-3.5 h-3.5 text-[#B84A62]" />
                          <span>Patisserie Reward</span>
                        </span>
                        <span className="font-mono-tabular font-semibold text-[#231712]">
                          {treat.pointsCost} pts
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#231712]">
                        {treat.title}
                      </h4>
                      <p className="text-xs text-[#6E5D53] leading-relaxed">
                        {treat.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleRedeemClick(treat)}
                      className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                        isJustRedeemed
                          ? 'bg-[#231712] text-[#C69C53] cursor-pointer'
                          : canAfford
                          ? 'bg-[#B84A62] hover:bg-[#A03B52] text-white cursor-pointer'
                          : 'bg-[#F3EFEA] text-[#9C897B] cursor-not-allowed'
                      }`}
                    >
                      {isJustRedeemed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart (₱0)</span>
                        </>
                      ) : canAfford ? (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Redeem for {treat.pointsCost} pts</span>
                        </>
                      ) : (
                        <span>
                          Need {treat.pointsCost - summary.availablePoints} more pts
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points Ledger Table from Placed Orders */}
          <div className="space-y-3">
            <h3 className="font-serif-display text-xl font-semibold text-[#231712]">
              Points Earned from Orders
            </h3>
            <div className="rounded-xl border border-[#E6DFD5] bg-white overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F3EFEA] text-[#6E5D53] border-b border-[#E6DFD5]">
                    <th className="py-2.5 px-4 font-medium">Order / Event</th>
                    <th className="py-2.5 px-4 font-medium">Date</th>
                    <th className="py-2.5 px-4 font-medium text-right">Order Total</th>
                    <th className="py-2.5 px-4 font-medium text-right">Points Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFD5]">
                  {orders.map((ord) => {
                    const pts = Math.floor(ord.total / 10);
                    return (
                      <tr key={ord.orderId}>
                        <td className="py-2.5 px-4 font-mono-tabular font-medium text-[#231712]">
                          {ord.orderId} · {ord.fulfilmentMode}
                        </td>
                        <td className="py-2.5 px-4 text-[#6E5D53]">{ord.createdAt}</td>
                        <td className="py-2.5 px-4 text-right font-mono-tabular text-[#231712]">
                          ₱{ord.total.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono-tabular font-semibold text-[#8C6D58]">
                          +{pts} pts
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#231712]">
                      SweetBites Patisserie Welcome Bonus
                    </td>
                    <td className="py-2.5 px-4 text-[#6E5D53]">Member Enrollment</td>
                    <td className="py-2.5 px-4 text-right font-mono-tabular text-[#6E5D53]">
                      —
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono-tabular font-semibold text-[#8C6D58]">
                      +{summary.welcomeBonus} pts
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
