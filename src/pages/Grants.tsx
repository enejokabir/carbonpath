import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Search,
  MapPin,
  PoundSterling,
  Building2,
  Calendar,
  ArrowRight,
  Lock,
  Filter,
  X,
  Bookmark,
  BookmarkCheck,
  Coins,
  FileText,
  Percent,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { matchGrantsToProfile, matchSubsidiesToProfile, type ExtendedGrant, type Subsidy, type MatchedGrant, type MatchedSubsidy } from "@/lib/matchingService";

const regions = ["All Regions", "East Midlands", "Derby City", "UK-wide", "England", "Wales", "Midlands"];
const types = ["All Types", "Energy Efficiency", "Decarbonisation", "Industrial", "Consultancy", "Transport"];
const subsidyTypes = ["All Types", "tax_relief", "rate_reduction", "loan", "voucher", "rebate"];
const sectors = ["All Sectors", "Manufacturing", "Retail", "Logistics", "Professional Services", "Tech", "Hospitality"];

const subsidyTypeLabels: Record<string, string> = {
  tax_relief: "Tax Relief",
  rate_reduction: "Rate Reduction",
  loan: "Loan",
  voucher: "Voucher",
  rebate: "Rebate",
  other: "Other",
};

export default function Grants() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("grants");

  // Grants state
  const [grants, setGrants] = useState<MatchedGrant[]>([]);
  const [grantsLoading, setGrantsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedGrant, setSelectedGrant] = useState<MatchedGrant | null>(null);
  const [savedGrants, setSavedGrants] = useState<string[]>([]);

  // Subsidies state
  const [subsidies, setSubsidies] = useState<MatchedSubsidy[]>([]);
  const [subsidiesLoading, setSubsidiesLoading] = useState(true);
  const [subsidySearchQuery, setSubsidySearchQuery] = useState("");
  const [selectedSubsidyType, setSelectedSubsidyType] = useState("All Types");
  const [selectedSubsidy, setSelectedSubsidy] = useState<MatchedSubsidy | null>(null);
  const [savedSubsidies, setSavedSubsidies] = useState<string[]>([]);

  // Load user and profile
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profileData) setProfile(profileData);
      }
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profileData) setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    // Load saved items from localStorage
    const savedGrantsData = localStorage.getItem("savedGrants");
    const savedSubsidiesData = localStorage.getItem("savedSubsidies");
    if (savedGrantsData) setSavedGrants(JSON.parse(savedGrantsData));
    if (savedSubsidiesData) setSavedSubsidies(JSON.parse(savedSubsidiesData));

    return () => subscription.unsubscribe();
  }, []);

  // Load grants from Supabase
  useEffect(() => {
    const loadGrants = async () => {
      setGrantsLoading(true);
      const { data, error } = await supabase
        .from("grants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading grants:", error);
        toast.error("Failed to load grants");
      } else if (data) {
        const matchedGrants = matchGrantsToProfile(data as ExtendedGrant[], profile, profile?.location);
        setGrants(matchedGrants);
      }
      setGrantsLoading(false);
    };

    loadGrants();
  }, [profile]);

  // Load subsidies from Supabase
  useEffect(() => {
    const loadSubsidies = async () => {
      setSubsidiesLoading(true);
      const { data, error } = await supabase
        .from("subsidies")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading subsidies:", error);
        toast.error("Failed to load subsidies");
      } else if (data) {
        const matchedSubsidies = matchSubsidiesToProfile(data as Subsidy[], profile, profile?.employees);
        setSubsidies(matchedSubsidies);
      }
      setSubsidiesLoading(false);
    };

    loadSubsidies();
  }, [profile]);

  const toggleSaveGrant = (grantId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to save grants");
      return;
    }

    const newSavedGrants = savedGrants.includes(grantId)
      ? savedGrants.filter(id => id !== grantId)
      : [...savedGrants, grantId];

    setSavedGrants(newSavedGrants);
    localStorage.setItem("savedGrants", JSON.stringify(newSavedGrants));
    toast.success(newSavedGrants.includes(grantId) ? "Grant saved to dashboard" : "Grant removed from saved");
  };

  const toggleSaveSubsidy = (subsidyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to save subsidies");
      return;
    }

    const newSavedSubsidies = savedSubsidies.includes(subsidyId)
      ? savedSubsidies.filter(id => id !== subsidyId)
      : [...savedSubsidies, subsidyId];

    setSavedSubsidies(newSavedSubsidies);
    localStorage.setItem("savedSubsidies", JSON.stringify(newSavedSubsidies));
    toast.success(newSavedSubsidies.includes(subsidyId) ? "Subsidy saved to dashboard" : "Subsidy removed from saved");
  };

  // Filter grants
  const filteredGrants = grants.filter((grant) => {
    const matchesSearch = grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "All Regions" ||
      (grant.location_scope && grant.location_scope.some(l => l.toLowerCase().includes(selectedRegion.toLowerCase())));
    const matchesType = selectedType === "All Types" || grant.grant_type === selectedType;
    const matchesSector = selectedSector === "All Sectors" ||
      (grant.sectors && grant.sectors.some(s => s.toLowerCase().includes(selectedSector.toLowerCase())));

    return matchesSearch && matchesRegion && matchesType && matchesSector;
  });

  // Filter subsidies
  const filteredSubsidies = subsidies.filter((subsidy) => {
    const matchesSearch = subsidy.name.toLowerCase().includes(subsidySearchQuery.toLowerCase()) ||
      subsidy.description.toLowerCase().includes(subsidySearchQuery.toLowerCase());
    const matchesType = selectedSubsidyType === "All Types" || subsidy.subsidy_type === selectedSubsidyType;

    return matchesSearch && matchesType;
  });

  const clearGrantFilters = () => {
    setSearchQuery("");
    setSelectedRegion("All Regions");
    setSelectedType("All Types");
    setSelectedSector("All Sectors");
  };

  const clearSubsidyFilters = () => {
    setSubsidySearchQuery("");
    setSelectedSubsidyType("All Types");
  };

  const hasGrantFilters = searchQuery || selectedRegion !== "All Regions" ||
    selectedType !== "All Types" || selectedSector !== "All Sectors";

  const hasSubsidyFilters = subsidySearchQuery || selectedSubsidyType !== "All Types";

  const renderGrantCard = (grant: MatchedGrant) => (
    <Card
      key={grant.id}
      className={`border hover:border-primary/50 transition-all cursor-pointer ${
        selectedGrant?.id === grant.id ? "border-primary ring-2 ring-primary/20" : ""
      }`}
      onClick={() => setSelectedGrant(grant)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{grant.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              {grant.amount_description && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <PoundSterling className="w-3 h-3" />
                  {grant.amount_description}
                </Badge>
              )}
              {grant.location_scope && grant.location_scope[0] && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {grant.location_scope[0]}
                </Badge>
              )}
              {grant.grant_type && <Badge variant="outline">{grant.grant_type}</Badge>}
              {profile && grant.matchScore > 60 && (
                <Badge className="bg-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {grant.matchScore}% Match
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={(e) => toggleSaveGrant(grant.id, e)}
          >
            {savedGrants.includes(grant.id) ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
        </div>
        <CardDescription className="text-base">{grant.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {grant.sectors && grant.sectors.length > 0 && (
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {grant.sectors.slice(0, 2).join(", ")}
              {grant.sectors.length > 2 && ` +${grant.sectors.length - 2}`}
            </span>
          )}
          {grant.deadline && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {grant.deadline}
            </span>
          )}
        </div>
        {grant.matchReasons && grant.matchReasons.length > 0 && profile && (
          <div className="mt-3 flex flex-wrap gap-1">
            {grant.matchReasons.slice(0, 2).map((reason, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {reason}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSubsidyCard = (subsidy: MatchedSubsidy) => (
    <Card
      key={subsidy.id}
      className={`border hover:border-primary/50 transition-all cursor-pointer ${
        selectedSubsidy?.id === subsidy.id ? "border-primary ring-2 ring-primary/20" : ""
      }`}
      onClick={() => setSelectedSubsidy(subsidy)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{subsidy.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Coins className="w-3 h-3" />
                {subsidyTypeLabels[subsidy.subsidy_type] || subsidy.subsidy_type}
              </Badge>
              {subsidy.value_description && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  {subsidy.value_description}
                </Badge>
              )}
              {profile && subsidy.matchScore > 60 && (
                <Badge className="bg-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {subsidy.matchScore}% Match
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={(e) => toggleSaveSubsidy(subsidy.id, e)}
          >
            {savedSubsidies.includes(subsidy.id) ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
        </div>
        <CardDescription className="text-base">{subsidy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {subsidy.matchReasons && subsidy.matchReasons.length > 0 && profile && (
          <div className="flex flex-wrap gap-1">
            {subsidy.matchReasons.slice(0, 2).map((reason, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {reason}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderGrantDetails = () => {
    if (!selectedGrant) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a grant to see details</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>{selectedGrant.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            {selectedGrant.amount_description && (
              <Badge className="bg-primary">{selectedGrant.amount_description}</Badge>
            )}
            {selectedGrant.location_scope?.[0] && (
              <Badge variant="outline">{selectedGrant.location_scope[0]}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {user ? (
            <>
              <div>
                <h4 className="font-semibold mb-2">Eligibility</h4>
                <p className="text-sm text-muted-foreground">{selectedGrant.eligibility_text}</p>
              </div>

              {selectedGrant.whats_covered && selectedGrant.whats_covered.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">What's Covered</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedGrant.whats_covered.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedGrant.deadline && (
                <div>
                  <h4 className="font-semibold mb-2">Deadline</h4>
                  <p className="text-sm">{selectedGrant.deadline}</p>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  variant={savedGrants.includes(selectedGrant.id) ? "secondary" : "outline"}
                  className="w-full"
                  onClick={() => toggleSaveGrant(selectedGrant.id)}
                >
                  {savedGrants.includes(selectedGrant.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save Grant
                    </>
                  )}
                </Button>
                {selectedGrant.link && (
                  <Button className="w-full" asChild>
                    <a href={selectedGrant.link} target="_blank" rel="noopener noreferrer">
                      Visit Official Website
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/consultants">Find Application Help</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Register for free to see full eligibility criteria
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">Register Free</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSubsidyDetails = () => {
    if (!selectedSubsidy) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a subsidy to see details</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>{selectedSubsidy.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary">
              {subsidyTypeLabels[selectedSubsidy.subsidy_type]}
            </Badge>
            {selectedSubsidy.value_description && (
              <Badge variant="outline">{selectedSubsidy.value_description}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {user ? (
            <>
              <div>
                <h4 className="font-semibold mb-2">Eligibility</h4>
                <p className="text-sm text-muted-foreground">{selectedSubsidy.eligibility_text}</p>
              </div>

              {selectedSubsidy.location_scope && selectedSubsidy.location_scope.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Available In</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedSubsidy.location_scope.map((loc, i) => (
                      <Badge key={i} variant="outline">{loc}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  variant={savedSubsidies.includes(selectedSubsidy.id) ? "secondary" : "outline"}
                  className="w-full"
                  onClick={() => toggleSaveSubsidy(selectedSubsidy.id)}
                >
                  {savedSubsidies.includes(selectedSubsidy.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save Subsidy
                    </>
                  )}
                </Button>
                {selectedSubsidy.application_link && (
                  <Button className="w-full" asChild>
                    <a href={selectedSubsidy.application_link} target="_blank" rel="noopener noreferrer">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/consultants">Find a Tax Specialist</Link>
                </Button>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-xs text-amber-800">
                  Tax relief and subsidies should be discussed with a qualified accountant. Carbon Path provides information only.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Register for free to see full details
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">Register Free</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-mint-fresh/5" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Grants & Subsidies</h1>
            <p className="text-xl text-muted-foreground">
              Discover financial support for your sustainability journey - grants, tax relief, and subsidies
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="grants" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Grants ({grants.length})
            </TabsTrigger>
            <TabsTrigger value="subsidies" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Subsidies ({subsidies.length})
            </TabsTrigger>
          </TabsList>

          {/* Grants Tab */}
          <TabsContent value="grants" className="mt-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search grants..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[150px]">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="w-[150px]">
                    <Building2 className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasGrantFilters && (
                  <Button variant="ghost" size="sm" onClick={clearGrantFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredGrants.length} grant{filteredGrants.length !== 1 ? "s" : ""}
              {profile && " - sorted by relevance to your business"}
            </p>

            {/* Grants Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {grantsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredGrants.length > 0 ? (
                  filteredGrants.map(renderGrantCard)
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <p className="text-muted-foreground mb-4">No grants match your filters</p>
                      <Button variant="outline" onClick={clearGrantFilters}>Clear Filters</Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24">
                  {renderGrantDetails()}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Subsidies Tab */}
          <TabsContent value="subsidies" className="mt-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search subsidies..."
                  className="pl-10"
                  value={subsidySearchQuery}
                  onChange={(e) => setSubsidySearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={selectedSubsidyType} onValueChange={setSelectedSubsidyType}>
                  <SelectTrigger className="w-[150px]">
                    <Coins className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subsidyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "All Types" ? type : subsidyTypeLabels[type] || type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasSubsidyFilters && (
                  <Button variant="ghost" size="sm" onClick={clearSubsidyFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredSubsidies.length} subsid{filteredSubsidies.length !== 1 ? "ies" : "y"}
              {profile && " - sorted by relevance to your business"}
            </p>

            {/* Subsidies Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {subsidiesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredSubsidies.length > 0 ? (
                  filteredSubsidies.map(renderSubsidyCard)
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <p className="text-muted-foreground mb-4">No subsidies match your filters</p>
                      <Button variant="outline" onClick={clearSubsidyFilters}>Clear Filters</Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24">
                  {renderSubsidyDetails()}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="py-12 border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle>Not sure where to start?</CardTitle>
              <CardDescription>
                Take our assessment or calculate your carbon footprint to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 justify-center">
              <Button asChild>
                <Link to="/calculator">
                  Calculate Footprint <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/consultants">Find a Consultant</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
