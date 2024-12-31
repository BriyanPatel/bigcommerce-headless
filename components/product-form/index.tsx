'use client';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { AlertCircle, Check, Heart, Plus, X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';

import { FragmentOf } from '~/client/graphql';
import { Button } from '~/components/ui/button';
import { Link } from '~/components/link';
import { handleAddToCart } from './_actions/add-to-cart';
import { AddToCart } from './add-to-cart';
import { CheckboxField } from './fields/checkbox-field';
import { DateField } from './fields/date-field';
import { MultiLineTextField } from './fields/multi-line-text-field';
import { MultipleChoiceField } from './fields/multiple-choice-field';
import { NumberField } from './fields/number-field';
import { QuantityField } from './fields/quantity-field';
import { TextField } from './fields/text-field';
import { ProductFormFragment } from './fragment';
import { ProductFormData, useProductForm } from './use-product-form';

import { createWishlistAction } from './_actions/create-wishlist';
import { handleAddToWishlist, handleRemoveFromWishlist, getWishlistsData } from './_actions/wishlist-product';

interface WishlistItem {
  entityId?: string;
  productEntityId: number;
}

interface Wishlist {
  entityId: string;
  name: string;
  items: {
    edges?: Array<{
      node: WishlistItem;
    }>;
  } | WishlistItem[];
}

interface Props {
  product: FragmentOf<typeof ProductFormFragment>;
  wishlists: Wishlist[];
  customerId: string;
}

export const ProductForm = ({ product, wishlists: initialWishlists, customerId }: Props) => {
  const t = useTranslations('Product.Form');
  const productOptions = removeEdgesAndNodes(product.productOptions);
  const { handleSubmit, register, ...methods } = useProductForm();
  const [isProcessingWishlist, setIsProcessingWishlist] = useState(false);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [wishlists, setWishlists] = useState(initialWishlists);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loadingWishlistId, setLoadingWishlistId] = useState<string | null>(null);
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWishlistDropdown(false);
        setShowCreateForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setWishlists(initialWishlists);
  }, [initialWishlists]);

  const isProductInWishlist = (wishlist: Wishlist) => {
    if (!wishlist || !product) return false;

    if ('edges' in wishlist.items && wishlist.items.edges) {
      return wishlist.items.edges.some(edge => edge.node.productEntityId === product.entityId);
    }
    
    const items = wishlist.items as WishlistItem[];
    return items.some(item => item.productEntityId === product.entityId);
  };

  const productFormSubmit = async (data: ProductFormData) => {
    const result = await handleAddToCart(data, product);
    const quantity = Number(data.quantity);

    if (result.error) {
      toast.error(result.error || t('errorMessage'), {
        icon: <AlertCircle className="text-error-secondary" />,
      });
      return;
    }

    toast.success(
      () => (
        <div className="flex items-center gap-3">
          <span>
            {t.rich('addedProductQuantity', {
              cartItems: quantity,
              cartLink: (chunks) => (
                <Link className="font-semibold text-primary hover:text-secondary" href="/cart">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </div>
      ),
      { icon: <Check className="text-success-secondary" /> },
    );
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!customerId) {
      toast.error('Please login to add items to wishlist', {
        icon: <AlertCircle className="text-error-secondary" />,
      });
      return;
    }
    setShowWishlistDropdown(!showWishlistDropdown);
    setShowCreateForm(false);
  };

  const handleWishlistToggle = async (e: React.MouseEvent, wishlistId: string) => {
    e.preventDefault();
    setLoadingWishlistId(wishlistId);
    setIsProcessingWishlist(true);

    try {
      const wishlist = wishlists.find((w) => w.entityId === wishlistId);
      if (!wishlist) {
        throw new Error('Wishlist not found');
      }

      const isInWishlist = isProductInWishlist(wishlist);

      if (isInWishlist) {
        // Find the item entityId for removal
        const itemEntityId = 'edges' in wishlist.items && wishlist.items.edges
          ? wishlist.items.edges.find(edge => edge.node.productEntityId === product.entityId)?.node.entityId
          : (wishlist.items as WishlistItem[]).find(item => item.productEntityId === product.entityId)?.entityId;

        if (!itemEntityId) {
          throw new Error('Could not find wishlist item to remove');
        }

        const removeResult = await handleRemoveFromWishlist(itemEntityId, wishlistId, customerId);
        if (removeResult.error) throw new Error(removeResult.error);
      } else {
        const addResult = await handleAddToWishlist(product, wishlistId, customerId);
        if (addResult.error) throw new Error(addResult.error);
      }

      // Refresh wishlist data
      const freshWishlistData = await getWishlistsData(customerId);
      if (freshWishlistData?.edges) {
        const normalizedWishlists = freshWishlistData.edges.map(edge => ({
          ...edge.node,
          items: edge.node.items.edges
            ? edge.node.items.edges.map(itemEdge => ({
                entityId: itemEdge.node.entityId,
                productEntityId: itemEdge.node.productEntityId,
              }))
            : edge.node.items,
        }));
        setWishlists(normalizedWishlists);
      }

      toast.success(
        isInWishlist ? 'Product removed from wishlist' : 'Product added to wishlist',
        { icon: <Check className="text-success-secondary" /> }
      );

    } catch (error) {
      console.error('Wishlist operation error:', error);
      toast.error(error.message || 'Failed to update wishlist', {
        icon: <AlertCircle className="text-error-secondary" />,
      });
    } finally {
      setIsProcessingWishlist(false);
      setLoadingWishlistId(null);
    }
  };

  const handleCreateWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;
    setIsCreatingWishlist(true);

    try {
      const input = {
        name: newWishlistName,
        isPublic: false,
        items: [{ productEntityId: product.entityId }],
      };

      await createWishlistAction({ input, customerId });
      setNewWishlistName('');
      setShowCreateForm(false);

      // Refresh wishlist data
      const freshWishlistData = await getWishlistsData(customerId);
      if (freshWishlistData?.edges) {
        const normalizedWishlists = freshWishlistData.edges.map(edge => ({
          ...edge.node,
          items: edge.node.items.edges
            ? edge.node.items.edges.map(itemEdge => ({
                entityId: itemEdge.node.entityId,
                productEntityId: itemEdge.node.productEntityId,
              }))
            : edge.node.items,
        }));
        setWishlists(normalizedWishlists);
      }

      toast.success('Wishlist created successfully');
    } catch (error) {
      console.error('Create wishlist error:', error);
      toast.error('Failed to create wishlist');
    } finally {
      setIsCreatingWishlist(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FormProvider handleSubmit={handleSubmit} register={register} {...methods}>
        <form onSubmit={handleSubmit(productFormSubmit)} className="flex flex-col gap-6">
          <input type="hidden" value={product.entityId} {...register('product_id')} />

          {productOptions.map((option) => {
            switch (option.__typename) {
              case 'MultipleChoiceOption':
                return <MultipleChoiceField key={option.entityId} option={option} />;
              case 'CheckboxOption':
                return <CheckboxField key={option.entityId} option={option} />;
              case 'NumberFieldOption':
                return <NumberField key={option.entityId} option={option} />;
              case 'MultiLineTextFieldOption':
                return <MultiLineTextField key={option.entityId} option={option} />;
              case 'TextFieldOption':
                return <TextField key={option.entityId} option={option} />;
              case 'DateFieldOption':
                return <DateField key={option.entityId} option={option} />;
              default:
                return null;
            }
          })}

          <div className="pr-qty-buttonwrap flex items-stretch gap-3">
            <QuantityField />

            <div className="pr-btn-wrapper flex flex-col gap-4 @md:flex-row">
              <AddToCart disabled={product.availabilityV2.status === 'Unavailable'} />
            </div>

            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                className="flex h-full w-36 items-center justify-center gap-2 hover:bg-gray-50"
                onClick={handleWishlistClick}
                disabled={isProcessingWishlist}
                type="button"
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${showWishlistDropdown ? 'text-primary' : ''}`}
                />
                <span className="hidden sm:inline">Wishlist</span>
              </Button>

              {showWishlistDropdown && (
                <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-gray-200">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">My Wishlists</h3>
                      <button
                        onClick={() => setShowWishlistDropdown(false)}
                        className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {wishlists.length === 0 && !showCreateForm ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No wishlists yet. Create your first one below!
                      </div>
                    ) : (
                      <div className="py-2">
                        {wishlists.map((wishlist) => {
                          const isInWishlist = isProductInWishlist(wishlist);
                          return (
                            <button
                              key={wishlist.entityId}
                              className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                              onClick={(e) => handleWishlistToggle(e, wishlist.entityId)}
                              disabled={loadingWishlistId === wishlist.entityId}
                            >
                              {loadingWishlistId === wishlist.entityId ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              ) : (
                                <Heart
                                  className={`h-4 w-4 transition-colors ${
                                    isInWishlist
                                      ? 'fill-primary text-primary'
                                      : 'text-gray-400 group-hover:text-primary'
                                  }`}
                                />
                              )}
                              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                {wishlist.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    {!showCreateForm ? (
                      <button
                        className="hover:text-primary-dark flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-primary transition-colors"
                        onClick={() => setShowCreateForm(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Create New Wishlist
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary"
                            placeholder="Enter wishlist name"
                            value={newWishlistName}
                            onChange={(e) => setNewWishlistName(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setShowCreateForm(false)}
                            disabled={isCreatingWishlist}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                
                            onClick={handleCreateWishlist}
                            disabled={isCreatingWishlist}
                          >
                            {isCreatingWishlist ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Create
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                              )}
                            </div>
                          </div>
                        </form>
                      </FormProvider>
                    </div>
                  );
                };

                export default ProductForm;