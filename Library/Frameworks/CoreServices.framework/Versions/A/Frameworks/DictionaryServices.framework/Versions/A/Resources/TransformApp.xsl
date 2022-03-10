<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:d="http://www.apple.com/DTDs/DictionaryService-1.0.rng"
				version="1.0">
<xsl:output method="html" encoding="UTF-8" indent="no"
	doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
	doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />

<!--
	Root level template that defines the XML structure
-->

<xsl:template match="/">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="html">
	<xsl:copy>
		<xsl:attribute name="class"><xsl:value-of select="concat('apple_client-application ', $appearance-compliance)" /></xsl:attribute>
		<xsl:if test="$aria-label != ''">
			<xsl:attribute name="aria-label"><xsl:value-of select="$aria-label" /></xsl:attribute>
		</xsl:if>
		<xsl:if test="$rtl-direction != ''">
			<xsl:attribute name="dir">rtl</xsl:attribute>
		</xsl:if>
		<xsl:apply-templates select="@*|node()" />
	</xsl:copy>
</xsl:template>

<!--
	Embed specified link to the head element
-->
<xsl:template match="head">
	<head> <xsl:apply-templates />
	<xsl:if test="$base-url != ''">
		<xsl:element name="base">
			<xsl:attribute name="href"><xsl:value-of select="$base-url" /></xsl:attribute>
		</xsl:element>
	</xsl:if>
	<xsl:if test="$stylesheet-content != ''">
		<xsl:element name="style">
			<xsl:attribute name="type">text/css</xsl:attribute>
			<xsl:value-of select="$stylesheet-content" disable-output-escaping="yes" />
		</xsl:element>
	</xsl:if>
	</head>
</xsl:template>

<!--
	Default rule for all other tags
-->
<xsl:template match="@*|node()">
	<xsl:copy>
		<xsl:apply-templates select="@*|node()" />
	</xsl:copy>
</xsl:template>

</xsl:stylesheet>
