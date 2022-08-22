# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
import sys
# sys.path.insert(0, os.path.abspath('.'))

from datetime import date
from sphinx.locale import _

# -- Project information -----------------------------------------------------


def read_version_from_ci() -> str:
    """Read the version for the documentation from the pipeline definition

    To not maintain the documentation version in different places, just define
    at one place and use it in different places.

    The documentation version influences the version shown in the content of
    the document and the path of the published documentation.

    :returns: The version number for the documentation as defined in the CI/CD
        pipeline.

    :rtype: str
    """

    import yaml

    with open("../.gitlab-ci.yml", "r") as f:
        ci = yaml.safe_load(f)
        return ci.get(
                "variables", {"DOC_TARGET_VERSION": "1.0"}
                ).get("DOC_TARGET_VERSION")


release = read_version_from_ci()
version = release
project = "ICS app {}".format(release)
copyright = '{}, Univention GmbH'.format(date.today().year)
author = 'Univention GmbH'
html_show_copyright = True
language = 'en'

html_title = project

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    "sphinx_copybutton",
    "sphinxcontrib.spelling",
    "univention_sphinx_extension",
    "sphinx_sitemap",
    "sphinx_last_updated_by_git",
    "sphinxcontrib.inkscapeconverter",
    "sphinx.ext.intersphinx",
    "sphinxcontrib.bibtex",
    "sphinx_inline_tabs",
]

bibtex_bibfiles = ["bibliography.bib"]
bibtex_encoding = "utf-8"
bibtex_default_style = "unsrt"
bibtex_reference_style = "label"

# For more configuration options of Sphinx-copybutton, see the documentation
# https://sphinx-copybutton.readthedocs.io/en/latest/index.html
copybutton_prompt_text = r"\$ |> "
copybutton_prompt_is_regexp = True

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'univention_sphinx_book_theme'

html_context = {
    "pdf_download_filename": "ics-app.pdf",
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = []  # value is usally ['_static']

html_last_updated_fmt = "%a, %d. %b %Y at %H:%m (UTC%z)"

numfig = True
numfig_format = {
    "figure": _("Figure %s"),
    "table": _("Table %s"),
    "code-block": _("Listing %s"),
    "section": _("Section %s"),
}

if "spelling" in sys.argv:
    spelling_lang = "en"
    spelling_show_suggestions = True
    spelling_word_list_filename = ["spelling_wordlist"]
    suppress_warnings = ['git.too_shallow']


if "linkcheck" in sys.argv:
    suppress_warnings = ['git.too_shallow']

linkcheck_ignore = [
    r'https://ucs-sso-ng.example.com/admin/',
]

root_doc = "index"

rst_epilog = """
.. include:: /links.txt

.. include:: /abbreviations.txt
"""

intersphinx_mapping = {
    "uv-manual": ("https://docs.software-univention.de/manual/5.0/en", None)
}

latex_engine = 'lualatex'
latex_show_pagerefs = True
latex_show_urls = "footnote"
latex_documents = [
    (root_doc, 'ics-app.tex', project, author, "manual", False)]
latex_elements = {
    "papersize": "a4paper",
}
