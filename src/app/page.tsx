'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, Instagram, Facebook,
  ChevronDown, Send, Edit3, LogIn, LogOut, Settings, Save,
  Leaf, Award, Heart, Clock, Star, Package,
  MapPin, CreditCard, Banknote, QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAdminStore } from '@/lib/admin-store';
import { toast } from 'sonner';

/* ─── Types ─── */
interface SiteSettings {
  id: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  updatedAt: string;
}

interface Cheese {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin: string;
  elaboration: string;
  nutrition: string;
  price: string;
  imageUrl: string;
  order: number;
}

/* ─── Main Page ─── */
export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [cheeses, setCheeses] = useState<Cheese[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);

  // Admin state
  const { isAdmin, showLoginModal, setShowLoginModal, logout, showAdminPanel, setShowAdminPanel } = useAdminStore();

  // Admin edit states
  const [editSettings, setEditSettings] = useState<SiteSettings | null>(null);
  const [editCheeses, setEditCheeses] = useState<Cheese[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const [settingsRes, cheesesRes] = await Promise.all([
          fetch('/api/settings', { signal: controller.signal }),
          fetch('/api/cheeses', { signal: controller.signal }),
        ]);
        const settingsData = await settingsRes.json();
        const cheesesData = await cheesesRes.json();
        if (!controller.signal.aborted) {
          setSettings(settingsData);
          setEditSettings(settingsData);
          setCheeses(cheesesData);
          setEditCheeses(cheesesData);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        toast.error('Error al cargar datos');
      }
    })();
    return () => controller.abort();
  }, []);

  const handleSaveSettings = async () => {
    if (!editSettings) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editSettings)
      });
      if (res.ok) {
        setSettings(await res.json());
        toast.success('Configuración actualizada correctamente');
        setShowAdminPanel(false);
      }
    } catch {
      toast.error('Error al guardar la configuración');
    }
  };

  const handleSaveCheese = async (index: number) => {
    const cheese = editCheeses[index];
    try {
      const res = await fetch(`/api/cheeses/${cheese.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cheese)
      });
      if (res.ok) {
        const updated = await res.json();
        const newCheeses = [...cheeses];
        newCheeses[index] = updated;
        setCheeses(newCheeses);
        toast.success(`${cheese.name} actualizado`);
      }
    } catch {
      toast.error('Error al actualizar el queso');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactMessage) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
    setContactSending(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    setContactSending(false);
    toast.success('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
    setContactName('');
    setContactPhone('');
    setContactMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Login Modal ─── */}
      <LoginModal />

      {/* ─── Admin Panel Modal ─── */}
      <AdminPanelModal
        settings={editSettings}
        onSettingsChange={setEditSettings}
        onSaveSettings={handleSaveSettings}
        cheeses={editCheeses}
        onCheesesChange={setEditCheeses}
        onSaveCheese={handleSaveCheese}
      />

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 bg-[#3E2723]/95 backdrop-blur-md border-b border-[#5D4037]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/la-burratina-logo.png"
                alt="La Burratina"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#quesos" className="text-[#D7CCC8] hover:text-[#FFD54F] transition-colors text-sm tracking-wide">Nuestros Quesos</a>
              <a href="#porque" className="text-[#D7CCC8] hover:text-[#FFD54F] transition-colors text-sm tracking-wide">Por Qué Elegirnos</a>
              <a href="#contacto" className="text-[#D7CCC8] hover:text-[#FFD54F] transition-colors text-sm tracking-wide">Contacto</a>
            </nav>

            {/* Admin Button */}
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdminPanel(true)}
                    className="text-[#FFD54F] hover:bg-[#5D4037]/50"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-[#D7CCC8] hover:bg-[#5D4037]/50"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Salir</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLoginModal(true)}
                  className="text-[#D7CCC8]/60 hover:text-[#FFD54F] hover:bg-[#5D4037]/30"
                >
                  <LogIn className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-[#5D4037]/30 px-4 py-2 flex gap-4 overflow-x-auto">
          <a href="#quesos" className="text-[#D7CCC8] hover:text-[#FFD54F] transition-colors text-xs tracking-wide whitespace-nowrap">Nuestros Quesos</a>
          <a href="#porque" className="text-[#D7CCC8] hover:text-[#FFD54F] transition-colors text-xs tracking-wide whitespace-nowrap">Por Qué Elegirnos</a>
          <a href="#contacto" className="text-[#D7CCC8] hover:text-[#FFD54F] transition-colors text-xs tracking-wide whitespace-nowrap">Contacto</a>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── Hero Section ─── */}
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-bg.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#3E2723]/70 via-[#3E2723]/50 to-[#3E2723]/80" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[#FFD54F] tracking-[0.3em] text-sm md:text-base mb-4 font-medium">TRADICION ITALIANA</p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Quesos Artesanales
                <span className="block text-[#FFD54F]">de Primera Calidad</span>
              </h2>
              <p className="text-[#D7CCC8] text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
                Descubrí nuestra línea premium de quesos frescos italianos, elaborados con leche de vaca seleccionada y la tradición artesanal que nos distingue.
              </p>
              <a href="#quesos">
                <Button size="lg" className="bg-[#FFD54F] text-[#3E2723] hover:bg-[#FFCA28] font-semibold text-base px-8 py-6 rounded-full shadow-lg">
                  Conocé Nuestros Quesos
                  <ChevronDown className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </motion.div>
          </div>
        </section>

        {/* ─── Nuestros Quesos ─── */}
        <section id="quesos" className="py-16 md:py-24 bg-[#FFF8E1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <p className="text-[#8D6E63] tracking-widest text-sm mb-2">NUESTRA SELECCION</p>
              <h2 className="text-3xl md:text-5xl font-bold text-[#3E2723] mb-4">Nuestros Quesos</h2>
              <div className="w-20 h-1 bg-[#FFD54F] mx-auto rounded-full" />
            </motion.div>

            {/* Cheese Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
              {cheeses.map((cheese, index) => (
                <motion.div
                  key={cheese.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Card className="overflow-hidden border-[#D7CCC8] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 group h-full">
                    <div className="relative h-56 md:h-64 overflow-hidden">
                      <img
                        src={cheese.imageUrl}
                        alt={cheese.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white font-bold text-xl">{cheese.name}</h3>
                      </div>
                      {isAdmin && (
                        <div className="absolute top-3 right-3">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSaveCheese(index)}
                            className="bg-[#FFD54F] text-[#3E2723] hover:bg-[#FFCA28] shadow-md text-xs"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Guardar
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      {/* Price */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-[#3E2723]">{cheese.price}</span>
                        {isAdmin && (
                          <Input
                            value={editCheeses[index]?.price || ''}
                            onChange={(e) => {
                              const updated = [...editCheeses];
                              updated[index] = { ...updated[index], price: e.target.value };
                              setEditCheeses(updated);
                            }}
                            className="w-28 h-8 text-sm"
                            placeholder="Precio"
                          />
                        )}
                      </div>
                      <p className="text-[#6D4C41] text-sm leading-relaxed">{cheese.description}</p>

                      {/* Edit Description (Admin Only) */}
                      {isAdmin && (
                        <div className="mt-3">
                          <Label className="text-xs text-[#8D6E63]">Descripción</Label>
                          <Textarea
                            value={editCheeses[index]?.description || ''}
                            onChange={(e) => {
                              const updated = [...editCheeses];
                              updated[index] = { ...updated[index], description: e.target.value };
                              setEditCheeses(updated);
                            }}
                            className="mt-1 text-sm min-h-[80px]"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Accordion with Detailed Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-[#3E2723] text-center mb-8">
                Guía Completa de Cada Queso
              </h3>
              <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  {cheeses.map((cheese) => (
                    <AccordionItem
                      key={cheese.id}
                      value={cheese.slug}
                      className="bg-white rounded-xl border-[#D7CCC8] shadow-sm overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-5 hover:bg-[#FFF8E1] transition-colors">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 rounded-full bg-[#FFD54F]/20 flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 text-[#8D6E63]" />
                          </div>
                          <div>
                            <span className="text-lg font-bold text-[#3E2723]">{cheese.name}</span>
                            <span className="block text-sm text-[#8D6E63]">{cheese.price}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-6">
                          {/* Origin */}
                          <div>
                            <h4 className="text-sm font-bold text-[#8D6E63] tracking-wide mb-2 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              ORIGEN E HISTORIA
                            </h4>
                            <p className="text-[#5D4037] text-sm leading-relaxed">
                              {cheese.origin}
                              {isAdmin && (
                                <Textarea
                                  value={editCheeses[cheeses.indexOf(cheese)]?.origin || ''}
                                  onChange={(e) => {
                                    const idx = cheeses.indexOf(cheese);
                                    const updated = [...editCheeses];
                                    updated[idx] = { ...updated[idx], origin: e.target.value };
                                    setEditCheeses(updated);
                                  }}
                                  className="mt-2 text-sm min-h-[60px]"
                                />
                              )}
                            </p>
                          </div>

                          <Separator className="bg-[#D7CCC8]" />

                          {/* Elaboration */}
                          <div>
                            <h4 className="text-sm font-bold text-[#8D6E63] tracking-wide mb-2 flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              PROCESO DE ELABORACION ARTESANAL
                            </h4>
                            <div className="text-[#5D4037] text-sm leading-relaxed whitespace-pre-line">
                              {cheese.elaboration}
                              {isAdmin && (
                                <Textarea
                                  value={editCheeses[cheeses.indexOf(cheese)]?.elaboration || ''}
                                  onChange={(e) => {
                                    const idx = cheeses.indexOf(cheese);
                                    const updated = [...editCheeses];
                                    updated[idx] = { ...updated[idx], elaboration: e.target.value };
                                    setEditCheeses(updated);
                                  }}
                                  className="mt-2 text-sm min-h-[100px]"
                                />
                              )}
                            </div>
                          </div>

                          <Separator className="bg-[#D7CCC8]" />

                          {/* Nutrition */}
                          <div>
                            <h4 className="text-sm font-bold text-[#8D6E63] tracking-wide mb-2 flex items-center gap-2">
                              <Leaf className="w-4 h-4" />
                              INFORMACION NUTRICIONAL (por 100g)
                            </h4>
                            <div className="bg-[#FFF8E1] rounded-lg p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {cheese.nutrition.split('|').map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFD54F] shrink-0" />
                                    <span className="text-[#5D4037] text-sm">{item.trim()}</span>
                                  </div>
                                ))}
                              </div>
                              {isAdmin && (
                                <Textarea
                                  value={editCheeses[cheeses.indexOf(cheese)]?.nutrition || ''}
                                  onChange={(e) => {
                                    const idx = cheeses.indexOf(cheese);
                                    const updated = [...editCheeses];
                                    updated[idx] = { ...updated[idx], nutrition: e.target.value };
                                    setEditCheeses(updated);
                                  }}
                                  className="mt-3 text-sm min-h-[60px]"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Por Qué Elegirnos ─── */}
        <section id="porque" className="py-16 md:py-24 bg-[#3E2723]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <p className="text-[#FFD54F] tracking-widest text-sm mb-2">NUESTRA DIFERENCIA</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Por Qué Mozzarella <span className="text-[#FFD54F]">Fior di Latte?</span>
              </h2>
              <div className="w-20 h-1 bg-[#FFD54F] mx-auto rounded-full" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: <Leaf className="w-8 h-8" />,
                  title: '100% Natural',
                  description: 'Sin conservantes ni aditivos artificiales. Solo leche fresca de vaca de alta calidad, cultivos lácticos naturales y sal. Un producto auténtico como lo hacían nuestros abuelos italianos.'
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: 'Tradición Artesanal',
                  description: 'Método pasta filata artesanal transmitido de generación en generación. Cada pieza es trabajada a mano por maestros queseros con décadas de experiencia en el oficio.'
                },
                {
                  icon: <Star className="w-8 h-8" />,
                  title: 'Premium Quality',
                  description: 'Leche de vacas alimentadas con pastos naturales, proceso de maduración controlado y selección rigurosa de cada lote. Garantizamos la máxima frescura y calidad en cada producto.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Card className="bg-[#4E342E] border-[#5D4037] text-white h-full hover:bg-[#5D4037] transition-colors duration-300">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#FFD54F]/20 flex items-center justify-center mx-auto mb-6 text-[#FFD54F]">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-[#D7CCC8] text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Contacto y Pedidos ─── */}
        <section id="contacto" className="py-16 md:py-24 bg-[#EFEBE9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <p className="text-[#8D6E63] tracking-widest text-sm mb-2">ESTAMOS PARA VOS</p>
              <h2 className="text-3xl md:text-5xl font-bold text-[#3E2723] mb-4">Contacto y Pedidos</h2>
              <div className="w-20 h-1 bg-[#FFD54F] mx-auto rounded-full" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white border-[#D7CCC8] shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-[#3E2723] text-xl flex items-center gap-2">
                      <Send className="w-5 h-5 text-[#FFD54F]" />
                      Envianos tu Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-[#5D4037]">Nombre completo</Label>
                        <Input
                          id="name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Tu nombre"
                          className="border-[#D7CCC8] focus:border-[#FFD54F]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-[#5D4037]">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="Tu teléfono"
                          className="border-[#D7CCC8] focus:border-[#FFD54F]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-[#5D4037]">Mensaje / Pedido</Label>
                        <Textarea
                          id="message"
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Contanos que queres pedir o tu consulta..."
                          className="border-[#D7CCC8] focus:border-[#FFD54F] min-h-[120px]"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={contactSending}
                        className="w-full bg-[#FFD54F] text-[#3E2723] hover:bg-[#FFCA28] font-semibold py-6 rounded-lg"
                      >
                        {contactSending ? (
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 animate-spin" />
                            Enviando...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Enviar Pedido
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info + Payment Methods */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Contact Details */}
                <Card className="bg-white border-[#D7CCC8] shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-[#3E2723] text-xl flex items-center gap-2">
                      <Phone className="w-5 h-5 text-[#FFD54F]" />
                      Datos de Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF8E1] flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-[#8D6E63]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#8D6E63]">Teléfono</p>
                        <p className="text-[#3E2723] font-medium">{settings?.phone || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF8E1] flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-[#8D6E63]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#8D6E63]">Email</p>
                        <p className="text-[#3E2723] font-medium">{settings?.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF8E1] flex items-center justify-center shrink-0">
                        <Instagram className="w-5 h-5 text-[#8D6E63]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#8D6E63]">Instagram</p>
                        <p className="text-[#3E2723] font-medium">{settings?.instagram || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF8E1] flex items-center justify-center shrink-0">
                        <Facebook className="w-5 h-5 text-[#8D6E63]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#8D6E63]">Facebook</p>
                        <p className="text-[#3E2723] font-medium">{settings?.facebook || '—'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="bg-white border-[#D7CCC8] shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-[#3E2723] text-xl flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#FFD54F]" />
                      Medios de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 bg-[#FFF8E1] rounded-lg p-3">
                        <CreditCard className="w-5 h-5 text-[#8D6E63]" />
                        <span className="text-sm text-[#3E2723]">Tarjeta</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#FFF8E1] rounded-lg p-3">
                        <Banknote className="w-5 h-5 text-[#8D6E63]" />
                        <span className="text-sm text-[#3E2723]">Efectivo</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#FFF8E1] rounded-lg p-3">
                        <QrCode className="w-5 h-5 text-[#8D6E63]" />
                        <span className="text-sm text-[#3E2723]">Transferencia</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#FFF8E1] rounded-lg p-3">
                        <Phone className="w-5 h-5 text-[#8D6E63]" />
                        <span className="text-sm text-[#3E2723]">Mercado Pago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-[#3E2723] border-t border-[#5D4037]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <img
                  src="/la-burratina-logo.png"
                  alt="La Burratina"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-[#D7CCC8] text-sm">Quesos artesanales de tradición italiana</p>
            </div>

            {/* Links */}
            <div className="flex justify-center gap-6">
              <a href="#quesos" className="text-[#D7CCC8] hover:text-[#FFD54F] transition-colors text-sm">Quesos</a>
              <a href="#porque" className="text-[#D7CCC8] hover:text-[#FFD54F] transition-colors text-sm">Nosotros</a>
              <a href="#contacto" className="text-[#D7CCC8] hover:text-[#FFD54F] transition-colors text-sm">Contacto</a>
            </div>

            {/* Social */}
            <div className="flex justify-center md:justify-end gap-4">
              {settings?.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#5D4037] hover:bg-[#FFD54F] flex items-center justify-center transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-[#D7CCC8] group-hover:text-[#3E2723]" />
                </a>
              )}
              {settings?.facebook && (
                <a
                  href={`https://facebook.com/${settings.facebook.toLowerCase().replace(/\s+/g, '.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#5D4037] hover:bg-[#FFD54F] flex items-center justify-center transition-colors group"
                >
                  <Facebook className="w-5 h-5 text-[#D7CCC8] group-hover:text-[#3E2723]" />
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="w-10 h-10 rounded-full bg-[#5D4037] hover:bg-[#FFD54F] flex items-center justify-center transition-colors group"
                >
                  <Mail className="w-5 h-5 text-[#D7CCC8] group-hover:text-[#3E2723]" />
                </a>
              )}
            </div>
          </div>

          <Separator className="bg-[#5D4037]/30 my-6" />

          <div className="text-center">
            <p className="text-[#D7CCC8]/60 text-xs">
              {new Date().getFullYear()} La Burratina - Quesos Artesanales. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Login Modal Component ─── */
function LoginModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showLoginModal, setShowLoginModal, login } = useAdminStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        login(data.admin.username);
        toast.success('Bienvenido, Administrador');
        setUsername('');
        setPassword('');
      } else {
        toast.error('Credenciales inválidas');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-md bg-white border-[#D7CCC8]">
        <DialogHeader>
          <DialogTitle className="text-[#3E2723] text-center text-xl flex items-center justify-center gap-2">
            <img
              src="/la-burratina-logo.png"
              alt="La Burratina"
              className="h-9 w-auto object-contain"
            />
            <span>Acceso Administrador</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="admin-user" className="text-[#5D4037]">Usuario</Label>
            <Input
              id="admin-user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario administrador"
              className="border-[#D7CCC8] focus:border-[#FFD54F]"
            />
          </div>
          <div>
            <Label htmlFor="admin-pass" className="text-[#5D4037]">Contraseña</Label>
            <Input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="border-[#D7CCC8] focus:border-[#FFD54F]"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD54F] text-[#3E2723] hover:bg-[#FFCA28] font-semibold py-5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                Verificando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Ingresar
              </span>
            )}
          </Button>
          <p className="text-center text-xs text-[#8D6E63]">
            Solo personal autorizado tiene acceso.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Admin Panel Modal Component ─── */
function AdminPanelModal({
  settings,
  onSettingsChange,
  onSaveSettings,
  cheeses,
  onCheesesChange,
  onSaveCheese,
}: {
  settings: SiteSettings | null;
  onSettingsChange: (s: SiteSettings | null) => void;
  onSaveSettings: () => void;
  cheeses: Cheese[];
  onCheesesChange: (c: Cheese[]) => void;
  onSaveCheese: (index: number) => void;
}) {
  const { showAdminPanel, setShowAdminPanel } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'contact' | 'prices'>('contact');

  if (!settings) return null;

  return (
    <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
      <DialogContent className="sm:max-w-2xl bg-white border-[#D7CCC8] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#3E2723] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#FFD54F]" />
            Panel de Administración
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'contact' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('contact')}
            className={activeTab === 'contact' ? 'bg-[#FFD54F] text-[#3E2723] hover:bg-[#FFCA28]' : 'border-[#D7CCC8] text-[#5D4037]'}
          >
            <Phone className="w-4 h-4 mr-1" />
            Contacto y Redes
          </Button>
          <Button
            variant={activeTab === 'prices' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('prices')}
            className={activeTab === 'prices' ? 'bg-[#FFD54F] text-[#3E2723] hover:bg-[#FFCA28]' : 'border-[#D7CCC8] text-[#5D4037]'}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Precios y Quesos
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'contact' ? (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div>
                <Label className="text-[#5D4037] flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Teléfono
                </Label>
                <Input
                  value={settings.phone}
                  onChange={(e) => onSettingsChange({ ...settings, phone: e.target.value })}
                  className="border-[#D7CCC8] focus:border-[#FFD54F]"
                  placeholder="+54 11 5555-1234"
                />
              </div>
              <div>
                <Label className="text-[#5D4037] flex items-center gap-1">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input
                  value={settings.email}
                  onChange={(e) => onSettingsChange({ ...settings, email: e.target.value })}
                  className="border-[#D7CCC8] focus:border-[#FFD54F]"
                  placeholder="info@laburratina.com"
                />
              </div>
              <div>
                <Label className="text-[#5D4037] flex items-center gap-1">
                  <Instagram className="w-4 h-4" /> Instagram
                </Label>
                <Input
                  value={settings.instagram}
                  onChange={(e) => onSettingsChange({ ...settings, instagram: e.target.value })}
                  className="border-[#D7CCC8] focus:border-[#FFD54F]"
                  placeholder="@laburratina.uy"
                />
              </div>
              <div>
                <Label className="text-[#5D4037] flex items-center gap-1">
                  <Facebook className="w-4 h-4" /> Facebook
                </Label>
                <Input
                  value={settings.facebook}
                  onChange={(e) => onSettingsChange({ ...settings, facebook: e.target.value })}
                  className="border-[#D7CCC8] focus:border-[#FFD54F]"
                  placeholder="La Burratina Quesos Artesanales"
                />
              </div>
              <Button
                onClick={onSaveSettings}
                className="w-full bg-[#FFD54F] text-[#3E2723] hover:bg-[#FFCA28] font-semibold py-5"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="prices"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              {cheeses.map((cheese, index) => (
                <div key={cheese.id} className="bg-[#FFF8E1] rounded-lg p-4">
                  <h4 className="font-bold text-[#3E2723] mb-3">{cheese.name}</h4>
                  <div>
                    <Label className="text-[#5D4037] text-sm">Precio</Label>
                    <Input
                      value={cheese.price}
                      onChange={(e) => {
                        const updated = [...cheeses];
                        updated[index] = { ...updated[index], price: e.target.value };
                        onCheesesChange(updated);
                      }}
                      className="border-[#D7CCC8] focus:border-[#FFD54F] mb-3"
                      placeholder="$X.XXX"
                    />
                  </div>
                  <div>
                    <Label className="text-[#5D4037] text-sm">URL de Imagen</Label>
                    <Input
                      value={cheese.imageUrl}
                      onChange={(e) => {
                        const updated = [...cheeses];
                        updated[index] = { ...updated[index], imageUrl: e.target.value };
                        onCheesesChange(updated);
                      }}
                      className="border-[#D7CCC8] focus:border-[#FFD54F] mb-3"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onSaveCheese(index)}
                    className="bg-[#FFD54F] text-[#3E2723] hover:bg-[#FFCA28]"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Guardar
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
