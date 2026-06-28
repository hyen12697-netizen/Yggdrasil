import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ForumProvider } from './context/ForumContext'
import { CartProvider } from './context/CartContext'
import { PromotionProvider } from './context/PromotionContext'
import { OrderProvider } from './context/OrderContext'
import { NotificationProvider } from './context/NotificationContext'
import { BannerProvider } from './context/BannerContext'
import { HeroBannerProvider } from './context/HeroBannerContext'
import { WishlistProvider } from './context/WishlistContext'
import { CustomerProvider } from './context/CustomerContext'
import { PopupProvider } from './context/PopupContext'
import { ProductProvider } from './context/ProductContext'
import { ContentProvider } from './context/ContentContext'
import { SystemNotificationProvider } from './context/SystemNotificationContext.jsx'
import { StaffProvider } from './context/StaffContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <CustomerProvider>
          <StaffProvider>
            <ProductProvider>
              <ContentProvider>
                <CartProvider>
                  <WishlistProvider>
                    <OrderProvider>
                      <ForumProvider>
                        <PromotionProvider>
                          <BannerProvider>
                            <HeroBannerProvider>
                              <PopupProvider>
                                <BrowserRouter>
                                  <SystemNotificationProvider>
                                    <App />
                                  </SystemNotificationProvider>
                                </BrowserRouter>
                              </PopupProvider>
                            </HeroBannerProvider>
                          </BannerProvider>
                        </PromotionProvider>
                      </ForumProvider>
                    </OrderProvider>
                  </WishlistProvider>
                </CartProvider>
              </ContentProvider>
            </ProductProvider>
          </StaffProvider>
        </CustomerProvider>
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>,
)
